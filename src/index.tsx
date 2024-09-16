import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'reflect-metadata/lite';
// import { MyPerson } from './test';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

// Reflect.defineMetadata('__injectable__', true, MyPerson);

// console.log(
//   MyPerson.toString(),
//   Reflect.getMetadata('__injectable__', MyPerson)
// );
root.render(
  <React.Fragment>
    <App />
  </React.Fragment>
);
