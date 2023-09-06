# Link Lil

Link Lil is a simple API prototype for link shortening.

## Features

- Shrink url
- Get full url by shrinked url

## Installation and start

Link Lil requires [Docker](https://www.docker.com) and [Node.js](https://nodejs.org/) v16+ to run.

Compose and run containers for MySQL and Redis servers. Wait for the servers weill be ready for connections.
```sh
docker-compose up
```
Install the dependencies, build app and start the server.
```sh
cd link-lil
npm i
npm run build
npm run start:prod
```

## Usage
To make requests to the API, you can use the platform API for developers, for example [Postman](https://www.postman.com).
##### Shrink URL

To get a shrinked URL, complete the **`POST` request** with the full URL in the body:
```json
{
  "url": "https://full-url"
}
```
to the **endpoint: `{{url}}/shrink-url/`**
##### Get full URL back

To get a full URL, complete the **`GET` request** with the shrinked URL in the body:
```json
{
  "url": "https://short-url"
}
```
to the **endpoint: `{{url}}/full-url/`**

here **url** is `http://localhost:3000` in case of local server.
## Thinking about scaling
To scale this service to handle 10,000 URL generation requests per second and 100,000 URL resolve requests per second, we need a distributed architecture:

**URL Generation:** We would implement a distributed key generation system. It can share a set of URLs between different servers using sharding. For example, you can specify that server 1 generates hashes for URLs beginning with the letters A-M and server 2 for URLs beginning with the letters N-Z. This separation will reduce the likelihood of collisions.

**URL Resolution:** For URL resolution, horizontal scaling is essential. We would employ a load balancer in front of multiple service instances. This setup distributes incoming requests evenly, preventing any single instance from becoming a bottleneck.

**Data Storage:** Data should be stored in a distributed database. For example setting up a sharded MySQL environment. Sharding divides the dataset into smaller, more manageable pieces, distributing the load across multiple servers.

**Caching:** Redis would continue to play a crucial role as a cache for frequently accessed URLs. Caching reduces the load on the database, speeding up response times.

**Data Storage:** We would implement a data storage policy based on access frequency. Older data, such as short URLs that haven't been accessed for a defined period, would be archived. Additionally, implementing a garbage collection system for cleaning  short URLs that are no longer in use.


## License

MIT

