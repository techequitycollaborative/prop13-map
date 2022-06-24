# Prop 13 Map

A parcel level visualization of California commercial property tax inequity caused by Prop 13.

This project is based on initial work done by the HMC 2022 Clinic Team:
* [Anna Singer](https://github.com/annadsinger0)
* [Arun Ramakrishna](https://github.com/arunramakrishna)
* [Mariesa Teo](https://github.com/mariesateo)
* [Kripesh Ranabhat](https://github.com/kripeshr22)
* [Yury Namgung](https://github.com/yurynamgung)

## Requirements
This project requires a database connection. Ask the project lead for details.

## How to install and run locally
1. [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Clone this repo: `git clone https://github.com/techequitycollaborative/prop13-map.git`
3. Create .env files and populate variables:

	.env
	> PORT=8000
	>
	> DATABASE_URI=\<a valid database connection string>

	map/.env
	> REACT_APP_SERVER_URL=http://localhost:8000/
	>
	> REACT_APP_MAPBOX_ACCESS_TOKEN=\<a valid mapbox token>
	
4. Run `npm run build`
5. Run `npm run dev`