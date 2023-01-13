#!/bin/bash
set -e
set -u

# https://stackoverflow.com/questions/13227142/using-row-to-json-with-nested-joins
# https://gis.stackexchange.com/questions/112057/sql-query-to-have-a-complete-geojson-feature-from-postgis 
# SQL="select row_to_json(row) FROM (select *, ST_MakePoint(long::double precision, lat::double precision) as geometry from la_manual_est_table WHERE long <> '' and lat <> '') row;"
psql -t $1 --o features.geojson << EOF
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
