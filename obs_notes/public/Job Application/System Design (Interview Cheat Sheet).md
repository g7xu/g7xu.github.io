**Summary**: Key technologies for system design interviews — core databases (relational, NoSQL, blob, search), API gateway, load balancer, and queues. Each entry is what the building block is for and the knobs an interviewer expects you to name.

**Sources**: Rewritten from Hello Interview, [System Design in a Hurry — Key Technologies](https://www.hellointerview.com/learn/system-design/in-a-hurry/key-technologies). I learn best by rewriting and reorganizing what I have learned; if you want to learn this, go read Hello Interview.

**Last updated**: 2026-09-25

---

# Core databases

## Relational database (RDBMS)

- PostgreSQL or MySQL
- Used for transactional data
- A row represents a record; a column represents a single field on that record
- **SQL joins**: query data from multiple tables
	- Can also be a bottleneck
- **Indexes**: store data so it can be retrieved quickly
	- Implemented with a B-tree or a hash table
- **Transactions**: group multiple operations into a single atomic operation
	- All or nothing — every operation succeeds, or every operation fails

## NoSQL databases

- Cover a wide range of data models
- Good at handling:
	- Flexible data models
	- Scalability
	- Big data and real-time web apps
- What to know:
	- Data models: key-value stores, document stores, column-family stores, graph databases
	- Consistency models
	- Indexing
	- Scalability

See [[DynamoDB]] for a deep dive into one key-value store.

## Blob storage

- Amazon S3 or Google Cloud Storage
- Handles large blobs of data
- Durable
- Scalable
- Cost-effective
- Secure
- Upload and download directly from the client
- Chunking

## Search-optimized database

- Elasticsearch
- Built on **inverted indexes**:

```json
{
  "word1": [doc1, doc2, doc3],
  "word2": [doc2, doc3, doc4],
  "word3": [doc1, doc3, doc4]
}
```

- **Tokenization**: breaking text into smaller pieces
- **Stemming**: reducing words to their root form
- **Fuzzy search**: finding results that are similar to a given search term
- **Scaling**: scales easily by adding more nodes to a cluster

# API gateway

Routes incoming requests to the appropriate backend service. Handles cross-cutting concerns such as authentication, rate limiting, and logging.

# Load balancer

AWS Elastic Load Balancer, NGINX, HAProxy

Distributes a large volume of traffic across multiple machines.

- **L4 load balancer**: persistent connections such as WebSockets
- **L7 load balancer**: great flexibility in routing traffic to different services while minimizing the connection load downstream

# Queue

A buffer for bursty traffic, or a means of distributing work across the system.

- Decouples the producer from the consumer
- **Message ordering**: with priorities
- **Retry mechanism**: built-in retries
- **Dead letter queues**: store messages that cannot be processed
- **Scaling**: with partitions
- **Backpressure**: queue capacity

# Streams / event sourcing

*(TODO — not yet written)*

# API gateway deep dive

*(TODO — not yet written)*

## Related pages

- [[DynamoDB]] — deep dive into the NoSQL key-value store: data model, keys, indexes, consistency, DAX, streams
- [[Distributed System]] — microservices, service discovery, and the API gateway in context
- [[Software Development Lifecycle & System Design]] — the system design process this cheat sheet plugs into (storage → services & APIs → scaling)
- [[Deployment]] — AWS S3 details behind the blob-storage entry
- [[Operating Systems (Interview Cheat Sheet)]]
- [[Technical Interview Checklist]]
- [[Job Application Overview]]
