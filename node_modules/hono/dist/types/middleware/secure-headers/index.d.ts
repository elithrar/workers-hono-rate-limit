import type { MiddlewareHandler } from '../../types';
interface ContentSecurityPolicyOptions {
    defaultSrc?: string[];
    baseUri?: string[];
    childSrc?: string[];
    connectSrc?: string[];
    fontSrc?: string[];
    formAction?: string[];
    frameAncestors?: string[];
    frameSrc?: string[];
    imgSrc?: string[];
    manifestSrc?: string[];
    mediaSrc?: string[];
    objectSrc?: string[];
    reportTo?: string;
    sandbox?: string[];
    scriptSrc?: string[];
    scriptSrcAttr?: string[];
    scriptSrcElem?: string[];
    styleSrc?: string[];
    styleSrcAttr?: string[];
    styleSrcElem?: string[];
    upgradeInsecureRequests?: string[];
    workerSrc?: string[];
}
interface ReportToOptions {
    group: string;
    max_age: number;
    endpoints: ReportToEndpoint[];
}
interface ReportToEndpoint {
    url: string;
}
interface ReportingEndpointOptions {
    name: string;
    url: string;
}
type overridableHeader = boolean | string;
interface SecureHeadersOptions {
    contentSecurityPolicy?: ContentSecurityPolicyOptions;
    crossOriginEmbedderPolicy?: overridableHeader;
    crossOriginResourcePolicy?: overridableHeader;
    crossOriginOpenerPolicy?: overridableHeader;
    originAgentCluster: overridableHeader;
    referrerPolicy?: overridableHeader;
    reportingEndpoints?: ReportingEndpointOptions[];
    reportTo?: ReportToOptions[];
    strictTransportSecurity?: overridableHeader;
    xContentTypeOptions?: overridableHeader;
    xDnsPrefetchControl?: overridableHeader;
    xDownloadOptions?: overridableHeader;
    xFrameOptions?: overridableHeader;
    xPermittedCrossDomainPolicies?: overridableHeader;
    xXssProtection?: overridableHeader;
}
export declare const secureHeaders: (customOptions?: Partial<SecureHeadersOptions>) => MiddlewareHandler;
export {};
