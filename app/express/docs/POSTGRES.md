# Full Text Search

`tsvector` transforms data into a format optimized for full-text search. 
`tsquery` is a text query that can be matched against a `tsvector`.

https://www.postgresql.org/docs/current/datatype-textsearch.html

Regarding catching mistakes like typos, PostgreSQL's full-text search (using tsvector and tsquery) does not inherently support typo tolerance or fuzzy search. It's designed to match normalized tokens, so if you search for "ffoo" instead of "foo," it won't find "foo" automatically.

However, PostgreSQL does offer additional functions for approximate string matching, such as the pg_trgm module, which can help you perform similarity-based searches. The pg_trgm module provides functions for calculating the similarity between strings based on trigram matching, which can be useful for catching typos or misspellings. You can use the % operator or the similarity() function to search for similar strings.

Here's an example of using pg_trgm with ILIKE for a fuzzy search:

## ILIKE (insensitive LIKE)

sql
Copy code
SELECT title FROM tickets WHERE title % 'ffoo';
In this case, you would find records with similar strings, including those with typos like "ffoo" and the correct term "foo." Keep in mind that using pg_trgm requires installing the extension and might have some performance implications compared to using tsvector and tsquery alone.

In summary, while tsvector and tsquery are not designed to handle typos or misspellings by default, you can use additional PostgreSQL functions like the pg_trgm module to perform approximate string matching, which can help catch mistakes in search queries.