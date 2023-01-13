#!/bin/bash
set -e
set -u
# NB! This requires superuser or pg_write_server_files privileges and will write to a file on the server.
# psql -Atx --echo-all $1 << EOF
#     COPY (SELECT json_agg(row_to_json(la_manual_est_table))::text FROM la_manual_est_table WHERE address != '' AND lat != '' AND long != ''
#       ) to 'features.geojson';
# EOF

# https://stackoverflow.com/questions/13227142/using-row-to-json-with-nested-joins
SQL="select row_to_json(row) FROM (select *, ST_MakePoint(long::double precision, lat::double precision) as geometry from la_manual_est_table WHERE long <> '' and lat <> '') row;"
psql -t $1 --o features.geojson << EOF
--select row_to_json(row) FROM (
--select *, ST_MakePoint(long::double precision, lat::double precision) as geometry from la_manual_est_fixed WHERE long <> '' and lat <> '') row;
-- https://gis.stackexchange.com/questions/112057/sql-query-to-have-a-complete-geojson-feature-from-postgis
SELECT jsonb_build_object(
    'type',       'Feature',
    'id',         prop_id,
    'geometry',   geom,
    'properties', to_jsonb(row) - 'prop_id' - 'geom'
 )
 FROM (
 	SELECT *, ST_MakePoint(long::double precision, lat::double precision) as geom 
 	FROM la_manual_est_table
 	WHERE long <> '' and lat <> ''
 ) row;
EOF
tippecanoe features.geojson -z16 -r1 --cluster-distance=100 -o prop13.pmtiles -f --accumulate-attribute=subsidy:sum