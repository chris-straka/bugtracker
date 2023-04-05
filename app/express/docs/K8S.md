## sts StatefulSets 

Sts run a bunch of identical pods just like a deployment. 

## Ordered startup and shutdown 

Unlike deployments they have ordered startups and shutdowns. 

db_0 -> db_1 -> db_2  (scaling up)
db_2 -> db_1 -> db_0  (scaling down)

Whereas deployments can do this

db_0 -> db_2 -> db_1 

### Who cares?

If you're using replicas, you can't start a replica before the main DB. 

The pods are all based off the same specification, but they can have different roles.

It might also help if you're sharding, using a failover/leader election strategy, or using data synchronization.

## Stable network identity

This is helpful for distributed DBs, replicas, shards and systems were each DB pod has its own purpose. 
