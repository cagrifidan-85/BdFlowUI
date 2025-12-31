
import { PROJECT_BFF_PREFIX } from '../constants/api'

declare const getBaseApiURL: (projectBFFPrefix: string, serviceUrl: string) => string;

export const getApiURL = (serviceURL: string) => getBaseApiURL(PROJECT_BFF_PREFIX, serviceURL)
