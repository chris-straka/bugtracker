# Command

```sh
# -c configure
# fsync=off faster writes but prone to data loss
# synchronous_commit=off ibid
# full_page_writes=off ibid
# random_page_cost=1.0 can improve performance in some cases
postgres -c
```