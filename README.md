[![npm version](https://badge.fury.io/js/shlink-client.svg)](https://badge.fury.io/js/shlink-client)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/shlink-client)
![npm downloads](https://img.shields.io/npm/dt/shlink-client)
![npm licence](https://img.shields.io/npm/l/shlink-client)
![GitHub Repo stars](https://img.shields.io/github/stars/noook/shlink-client)

# shlink-client

Interact with your [Shlink.io](https://shlink.io) API more easily. This package covers the endpoints
provided by Shlink and types every input and output between your app and your API.

## Installation

```sh
$ npm i shlink-client

# Or with yarn

$ yarn add shlink-client
```

## API

Instanciate a new Shlink Client:

```js
import { ShlinkClient } from 'shlink-client';

const client = new ShlinkClient({
  url: 'https://yourdomain.tld',
  token: 'xxxxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
});
```

### Main entites declarations

ShortUrl:
```ts
interface ShortUrl {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  dateCreated: string;
  visitsCount: number;
  tags: string[];
  meta: {
    validSince: string | null;
    validUntil: string | null;
    maxVisits: number;
  };
  domain: string | null;
}
```


### client.shortenUrl(baseUrl, apiKey, longUrl, [options])

Creates a short URL in a single API call. Useful for third party integrations. This is the only static method for short URLs.

#### Parameters

`baseUrl`: URL of your Shlink API.

`apiKey`: Your Shlink API Key.

`longUrl`: URL to shorten

`options`: Specify the type of the payload you wish to get back:

```ts
interface ShortenUrlOptions {
  format: 'json' | 'txt';
}
```

### Response

When no options are provided, the default payload is a `ShortUrl` object. If `txt` is chosen, the full shortened URL is returned.

### client#getShortUrls([options])

Returns the list of short URLs.

#### Options

All fields are optional.

```ts
interface ShortUrlGetOptions {
  // The page to be displayed. Defaults to 1
  page?: number
  // A query used to filter results by searching for it on the longUrl and shortCode fields
  searchTerm?: string
  // A list of tags used to filter the result set. Only short URLs tagged with at least one of the provided tags will be returned
  tags?: string[]
  // The field from which you want to order the result
  orderBy?:  'longUrl-ASC' | 'longUrl-DESC' | 'shortCode-ASC' | 'shortCode-DESC' | 'dateCreated-ASC' | 'dateCreated-DESC' | 'visits-ASC' | 'visits-DESC'
  // The date (in ISO-8601 format) from which we want to get short URLs
  startDate?: string
  // The date (in ISO-8601 format) until which we want to get short URLs
  endDate?: string
}
```

#### Response

```ts
interface {
  data: ShortUrl[]
  pagination: {
    currentPage: number
    pagesCount: number
    itemsPerPage: number
    itemsInCurrentPage: number
    totalItems: number
  }
}
```

### client#getShortUrl(shortCode)

Get the long URL behind a short URL's short code.

#### Parameters

`shortCode`: The short code to edit.

#### Response

Returns a single `ShortUrl` object if found.

### client#editShortUrl(shortCode, [options, [domain]])

Update certain meta arguments from an existing short URL.

#### Parameters

`shortCode`: The short code to edit.

`options`: ShortUrl options. At least one field is required.

```ts
interface ShortUrlPatchOptions {
  longUrl?: string;
  validSince?: string;
  validUntil?: string;
  maxVisits?: number;
  validateUrl: boolean;
}
```

`domain`: The domain in which the short code should be searched for.

#### Response

Returns the updated `ShortUrl` object.

### client#createShortUrl(options)

Creates a new short URL.

#### Parameters

Shares most of the specificities of the edit method, except the `longUrl` property is required.

```ts
interface ShortUrlOptions {
  // URL to shorten
  longUrl: string;
  // Array of tags to attach to this short URL
  tags?: string[];
  // The date (in ISO-8601 format) from which the short URL is valid
  validSince?: string;
  // The date (in ISO-8601 format) from which the URL is no longer valid
  validUntil?: string;
  // Set your own short url instead of autogenerating a URL
  customSlug?: string;
  // Maximum visits allowed on this link
  maxVisits?: number;
  // Don't create another short URL if another one already uses this longUrl
  findIfExists?: boolean;
  // The domain in which the short code should be saved in
  domain?: string;
  // Length of the code
  shortCodeLength?: number;
  validateUrl?: boolean;
}
```

#### Response

Returns the created `ShortUrl` object.

### client#deleteShortUrl(shortCode)

Deletes the short URL for provided short code.

#### Parameters

`shortCode`: The short code to delete.

#### Response

Returns the delete `ShortUrl` shortCode.

### client#setShortUrlTags(shortCode, tags)

Edit the tags on URL identified by provided short code.

#### Parameters

`shortCode`: The short code to which you want to set the tags.

`tags`: Array of tags to assign the this short code. Older tags are not merged, but replaced with the new ones.

#### Response

Returns the shortCode's new tags.

### client#listTags(options)

List all available tags

#### Parameters

`options`:
```ts
interface ListTagsOptions {
  // Whether to add additional details about the tags visits / links
  withStats: boolean;
}
```

#### Response

Returns the list of available tags, and the details if requested

### client#renameTag(oldName, newName)

Renames a tag

#### Parameters

`oldName`: string of the previous tag name

`newName`: string of the new tag name


#### Response

An object with the new tag name, if succeeded.

### client#deleteTags(...tags)

Deletes tags

#### Parameters

`tags`: Takes as many arguments as tags to remove. Inexistant tags won't throw error.

#### Response

An object with the list of deleted tags

### client#getDomains()

Lists available domains

#### Response

Returns the list of available domains to create URLs

### client#getPixel(shortCode)

Generates a 1px transparent image which can be used to track emails with a short URL

#### Parameters

`shortCode`: The short code to which you want to get the pixel.

#### Response

A base64 encoded string of the pixel
### client#getQR(shortCode, options)

Generates a QR code image pointing to a short URL

#### Parameters

`shortCode`: The short code to which you want to get the QR Code.

`options`:
```ts
interface QRCodeOptions {
  format?: 'png' | 'svg'; // Format of the response (defaults to png)
  size?: number; // size in px of the QR Code (defaults to 300px)
} 
```

#### Response

An objet containing the MIME type of the QR Code, and the data in the requested format
