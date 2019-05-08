# Customer directory demo PWA 

### Stack used

1. Angular 7 - Framework, Router, State management
2. Firebase - Authentication, data store

### A demo is visible at 

https://businessdirectoryph.firebaseapp.com

### Pre-reqs to run the repo locally

1. Latest version of node installed 
2. `npm i -g @angular/cli`

### Installation & Development

1. Clone this repo: `git clone git@github.com:itsru/Customer-Directory-Demo.git`
2. `cd Customer-Directory-Demo`
3. `npm install`
4. If building for web simply run `ng build --prod`

### Purpose

This app is to demo the required task of building a customer directory with:
1. Unique customer identifiers
2. Status options per customer
3. Customer creation date and time
4. General information like name and contact details

The user should be able to:
1. Filter and sort the list of customers.
2. Click on a customer in the list to view their details and add/edit notes for that
customer.
3. Change their status.
4. A user interface for editing customer details other than their status and the notes is not required.

### Solution Methods

- **Auth:** I utilized a simple auth service and guard with firebase handling the credentials, I stored a local variable to speed up session replays.
- **Customer List/Search/Sort:** I utilized a simple filter to traverse the variables in within each customer to allow the search to work over the most common variables.
- **Status** The way I understood the requirements it seemed necessary to be able to set a status from the list view itself. So I implemented on both views.
- **Notes** I utilized a single modal to display add/edit capability without having to navigate away. 

### Known Issues

- npm will inform you of a high severity security vulnerability detected in tar < 4.4.2 and request you to update to ~> 4.4.2. This is a known issue with node-sass and is pending a release to resolve shortly. 

### Additional Links and Resources

- Angular - https://github.com/angular
- AngularFire2 - https://github.com/angular/angularfire2
- Firebase - https://firebase.google.com/

### Attributions

Icons made by [Smashicons](https://www.flaticon.com/authors/smashicons "Smashicons"), [DinosoftLabs](https://www.flaticon.com/authors/dinosoftlabs "DinosoftLabs"), and [geotatah](https://www.flaticon.com/authors/geotatah "geotatah") from [www.flaticon.com](www.flaticon.com). All licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/ "Creative Commons BY 3.0").
