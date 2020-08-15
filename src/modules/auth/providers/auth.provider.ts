import {
  OnRequest,
  ModuleConfig,
  ModuleSessionInfo,
} from '@graphql-modules/core';
import { Inject, Injectable, ProviderScope } from '@graphql-modules/di';
import axios from 'axios';

import { CurrentUser } from '../types';
import { AuthModuleConfig } from '../types/auth-module.config.type';
import { User } from '../../../graphql-codegen-types';

@Injectable({ scope: ProviderScope.Session })
export class AuthProvider implements OnRequest {
  private _currentUser: CurrentUser | undefined = undefined;
  private accessToken: string | undefined = undefined;

  constructor(
    @Inject(ModuleConfig('auth')) private authModuleConfig: AuthModuleConfig
  ) {}

  /**
   * Get current user.
   */
  get currentUser(): CurrentUser | undefined {
    return this._currentUser;
  }

  /**
   * Get current user ID.
   */
  get currentUserId(): string | undefined {
    return this._currentUser && typeof this._currentUser.sub === 'string'
      ? this._currentUser.sub
      : undefined;
  }

  /**
   * GraphQL Module's on request hook.
   * Executes on each HTTP graphql request.
   * @param session - Module session info.
   */
  onRequest({ session }: ModuleSessionInfo): void {
    // REVIEW: Caution with auth0's rate limit.
    // See: https://auth0.com/docs/policies/rate-limits#endpoints-with-rate-limits
    if (
      session &&
      Object.prototype.hasOwnProperty.call(session, 'req') &&
      session.req
    ) {
      const { req } = session;
      this._currentUser = req.user;

      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        this.accessToken = req.headers.authorization.split(' ')[1];
      }
    }
  }

  /**
   * Get current user's info from Auth0 `/userinfo` endpoint.
   * @returns A promise, which resolves with current user's info if authenticated; `null`otherwise.
   */
  async getCurrentUserInfoAsync(): Promise<User | null> {
    let currentUserInfo: User | null = null;

    if (this.accessToken && typeof this.accessToken === 'string') {
      const { data } = await axios.get(this.authModuleConfig.userInfoUri, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      if (data) {
        currentUserInfo = {
          id: data.sub,
          name: data.name,
          nickname: data.nickname,
          pictureUrl: data.picture,
        };
      }
    }

    return currentUserInfo;
  }

  /**
   * Determine if current user has permission specified.
   * @param permissions - List of permissions to check against; Current user is considered to be authorized if user contains at least one of the permissions listed.
   * @returns `true` if user has permission; `false` otherwise.
   */
  hasPermission(permissions: string[]): boolean {
    let hasPermission = false;

    if (
      !(
        permissions &&
        permissions.constructor === Array &&
        permissions.length > 0
      )
    ) {
      throw new Error(
        "Failed to check current user's permissions: Invalid permissions provided. "
      );
    }

    if (
      this._currentUser &&
      this._currentUser.permissions &&
      this._currentUser.permissions.length > 0
    ) {
      const currentUserPermissions = this._currentUser.permissions;

      hasPermission = permissions.some((permission) =>
        currentUserPermissions.includes(permission)
      );
    }

    return hasPermission;
  }

  /**
   * Determine if current user is authenticated.
   * @returns `true` if current user is authenticated; `false` otherwise.
   */
  isAuthenticated(): boolean {
    return !!this._currentUser;
  }
}
