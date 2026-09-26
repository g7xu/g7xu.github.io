**Summary**: DynamoDB deep dive — the table/item/attribute data model, partition and sort keys, GSIs vs. LSIs, consistent hashing and replication, consistency modes, DAX caching, DynamoDB Streams, and when not to use it.

**Sources**: Rewritten from Hello Interview, [System Design in a Hurry — Key Technologies](https://www.hellointerview.com/learn/system-design/in-a-hurry/key-technologies).

**Last updated**: 2026-09-25

---

# Data model

- **Tables** — collections of related data
- **Items** — individual records
- **Attributes** — the actual data fields within each item

# Primary keys

- **Partition key** — unique identifier that determines an item's physical storage location through hashing
- **Sort key** — secondary attribute that enables ordering and range queries within a partition
- Primary key = `{Partition Key}:{Sort Key}`

# Secondary indexes

- **Global Secondary Index (GSI)** — a different partition key from the table, to query by any attribute
- **Local Secondary Index (LSI)** — the same partition key as the table but a different sort key, for alternate sorting

# Distribution and consistency

- **Consistent hashing** — how items are spread across partitions
- **Fault tolerance** — changes are propagated asynchronously to replicas
- Two read modes: **eventual consistency** and **strong consistency**

# DAX

In-memory caching layer that provides microsecond response times for read-heavy workloads, with automatic read-through and write-through caching.

# DynamoDB Streams

Real-time change tracking of table modifications, used to trigger downstream processing such as Lambda functions, replication, or analytics.

# When not to use it

- Complex query patterns
- Multi-table transactions
- Data model complexity

## Related pages

- [[System Design (Interview Cheat Sheet)]] — the NoSQL entry this deep dive expands on, alongside the other core databases
- [[Distributed System]] — replication, consistency, and fault tolerance across machines
- [[Deployment]] — the other AWS services in the vault (EC2, S3)
