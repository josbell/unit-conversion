# UnitConversion

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.2.

## Introduction

This app is a unit conversion calculator that allows user to enter the value they think the converted value is and then calculates the value and informs them whether they were correct or not.

The app leverages the [covert-units](https://www.npmjs.com/package/convert-unit) library to make these calculations.


## Install Locally

 - Create a Firebase project on the [Firebase Console](https://console.firebase.google.com)
 - Install the required dependencies by running `npm install`
 - Follow [AngularFire2 instructions](https://github.com/angular/angularfire) to configure your webapp with your firebase project info
 - Install [unit-conversion-functions](https://github.com/josbell/unit-conversion-functions) and emulate locally to gain access to the [unit-convert](https://www.npmjs.com/package/convert-units) api
 
## Deploy
 - Create a Firebase project on the [Firebase Console](https://console.firebase.google.com)
 - Install the required dependencies by running `npm install` in the `functions` directory
 - Install [firebase-tools](https://www.npmjs.com/package/firebase-tools) globally
 - Deploy your project's code using `firebase deploy`
 - Install [unit-conversion-functions](https://github.com/josbell/unit-conversion-functions) and deploy

 
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
