# Full Text Search

`tsvector` transforms data into a format optimized for full-text search. 
`tsquery` is a text query that can be applied against a `tsvector` to find stuff.

https://www.postgresql.org/docs/current/datatype-textsearch.html

tsvector/tsquery does not have typo tolerance. It won't find "foo" if you type "ffoo".

pg_trgm can help with that I think.
