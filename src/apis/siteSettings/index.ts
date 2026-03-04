import { baseApi } from '../index';
import { SiteSettings } from '@app-types/siteSettings';

export interface UpdateSiteSettingsRequest {
  contact?: SiteSettings['contact'];
  campaignPopup?: SiteSettings['campaignPopup'];
  newsFeed?: SiteSettings['newsFeed'];
}

export const siteSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSiteSettings: builder.query<SiteSettings, void>({
      query: () => '/api/settings/site',
      providesTags: [{ type: 'SiteSettings', id: 'SITE' }],
    }),
    updateSiteSettings: builder.mutation<SiteSettings, UpdateSiteSettingsRequest>({
      query: (body) => ({
        url: '/api/settings/site',
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'SiteSettings', id: 'SITE' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSiteSettingsQuery, useUpdateSiteSettingsMutation } = siteSettingsApi;
