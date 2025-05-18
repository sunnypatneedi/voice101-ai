/// <reference types="@types/service_worker_api" />

declare const self: ServiceWorkerGlobalScope;

export interface ServiceWorkerMessage {
  type: string;
  [key: string]: any;
}

export interface ServiceWorkerEvent extends ExtendableEvent {
  waitUntil(promise: Promise<any>): void;
}

export interface FetchEvent extends ExtendableEvent {
  readonly request: Request;
  readonly clientId: string;
  readonly resultingClientId: string;
  readonly preloadResponse: Promise<any>;
  respondWith(response: Promise<Response> | Response): Promise<void>;
}

export interface InstallEvent extends ExtendableEvent {
  readonly activeWorker: ServiceWorker;
}

export interface ActivateEvent extends ExtendableEvent {
  readonly isUpdate?: boolean;
}

export interface SyncEvent extends ExtendableEvent {
  readonly lastChance: boolean;
  readonly tag: string;
}

export interface PushEvent extends ExtendableEvent {
  readonly data: PushMessageData;
}

export interface PushMessageData {
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  json(): Promise<any>;
  text(): string;
  json<T = any>(): Promise<T>;
}

declare global {
  interface Window {
    __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
    skipWaiting(): void;
  }

  interface ServiceWorkerGlobalScope {
    __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
    __precacheManifest: Array<{ url: string; revision: string }>;
    skipWaiting(): void;
  }

  interface Cache {
    addAll(requests: RequestInfo[]): Promise<void>;
  }
}
