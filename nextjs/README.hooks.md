# Chiselstrike hooks generator

NPM package for generating chiselstrike react hooks for chiselstrike framework

## Installation

NPM:

```
npm i @chisel-hooks --s
```

YARN:

```
yarn add @chisel-hooks
```

Then add this script `generate-chisel-hooks: chisel-hooks g` to your `package.json`;

## Generation

Run one of the following script:

NPM:

```
npm run generate-chisel-hooks
```

YARN:

```
yarn generate-chisel-hooks
```

From now on your hooks will be generated in `chisel.hooks.ts` file in the root directory of your project based on content of your `Chisel.toml` file. For detail informations how to work with chiselstrike framework please visit: https://docs.chiselstrike.com/, or take a look on some of our examples for specific technologies:

1. NextJS: https://github.com/chiselstrike/chiselstrike-examples/tree/main/nextjs
2. Gatsby: https://github.com/chiselstrike/chiselstrike-examples/tree/main/gatsby

## Basic usage

Lets say you have this chisel entity:

```typescript
export class Person extends ChiselEntity {
  firstName: string = "";
  lastName: string = "";
}
```

Thats all you need if you want to generate all crud operations for it. Then generate the hooks from it and you can use the hooks as bellow:
GET requests

```typescript
const { data, errors, isLoading, refetch } = usePersonGet();
```

POST requests

```typescript
const { post, errors, isLoading } = usePersonPost();
```

PUT requests

```typescript
const { put, errors, isLoading } = usePersonPut();
```

DELETE requests

```typescript
const { delete, errors, isLoading } = usePersonDelete();
```

## Caching

Under the hood chisel-hooks use caching for improved performance and for better ux. Default caching behavior is set to `cache-and-fetch`, but it can be changed simply through config file or in specific hook initialization. The accepted values are `cache-and-fetch`, `cache-or-fetch`, `cache-only` and `fetch-only`.

```typescript
const { data, errors, isLoading, refetch } = usePersonGet({
  cache: "fetch-only",
});
```

## Form API

Until now you have to write request and form handlers separately, which requires lot of code repetition and unnecesary abstraction. We are introducing a revolutionary solution, which combines those two together and implementation looks like this:

### Basic usage

Lets say you have this chisel entity:

```typescript
export class Person extends ChiselEntity {
  firstName: string = "";
  lastName: string = "";
}
```

Then you create input component with chisel hooks form api hook:

```typescript
// Input.tsx
import { useChiselInput } from "@chisel-hooks/form";

interface Props {
  name: string;
}

export const Input: FunctionComponent<Props> = ({ name }) => {
  const { inputParams } = useChiselInput({ name });
  return <input {...inputParams} />;
};
```

And form component itself:

```typescript
// PersonForm.tsx
import { usePersonPostForm } from "chisel.hooks";
import { Form } from "@chisel-hooks/form";
import { Input } from "./input";

export const PersonForm: FunctionComponent = () => {
  const alert = useSomeAlertLibrary();
  const form = usePersonPostForm({
    onSuccess: (successMessage) => alert.success(successMessage),
    onError: (error) => alert.error(error),
  });

  return (
    <Form form={form}>
      <>
        <Input name="firstName" />
        <Input name="lastName" />
        <button type="submit" />
      </>
    </Form>
  );
};
```

Thats it. Your form will be working as expected! Nothing more need it. Amazing right? Well, thats just a start...

### Editation forms

Our form api gives you the simpliest way to work with editation forms. We recognize that almost all editation forms are combined from 2 things. Data fetching and data mutation. In most applications these two are handled separately, even though it is completely unnecessary. We decided to change that and the usage is as bellow:

```typescript
// EditPersonForm.tsx
import { usePersonPutFormEdit } from 'chisel.hooks'
import { Form } from '@chisel-hooks/form';

const EditPersonForm: FunctionComponent = () => {
    const alert = useSomeAlertLibrary();
    const { form, fetch: { errors } } = usePersonPutFormEdit({
        onSuccess: successMessage => alert.success(successMessage),
        onError: error => alert.error(error)
        fetch: {
            onError: () => alert.error('Unable to fetch data'),
            refetchOnSave: false // default value,
            fetchOnMount: true // default value
        }
    })

    return (
        <Form form={form}>
            {isLoading ?
                <Spinner /> :
                <>
                    <Input name="firstName" />
                    <Input name="lastName" />
                    <button type="submit" />
                </>
            }
        </Form>
    )
}
```

### Options

#### InitialValues

Right now in the example default value from chisel entity are used. But it can be simply changed through initialValues.

```typescript
// PersonForm.tsx
import { usePersonPostForm } from "chisel.hooks";
import { Form } from "@chisel-hooks/form";
import { Input } from "./input";

export const PersonForm: FunctionComponent = () => {
  const alert = useSomeAlertLibrary();
  const form = usePersonPostForm({
    onSuccess: (successMessage) => alert.success(successMessage),
    onError: (error) => alert.error(error),
    initialValues: {
      firstName: "John",
    },
  });

  return (
    <Form form={form}>
      <>
        <Input name="firstName" />
        <Input name="lastName" />
        <button type="submit" />
      </>
    </Form>
  );
};
```

Now the form will always have firstName autofilled with value `John`.

#### Validation

Under the hood chisel-hooks used justvalidate (subject to change) api. Basic validation is already used in every form hook (something you cant get from any other form library). For example the example above already has required and string rule for firstName and lastName field. But if we want some more complex validation. Something generator cant find out from the chisel entity, we have super simply solution to add new rules based on one of the most popular validation api today! Based on the example above, the usage will look like this:

```typescript
// PersonForm.tsx
import { usePersonPostForm } from "chisel.hooks";
import { Form } from "@chisel-hooks/form";
import { Input } from "./input";

const PersonForm: FunctionComponent = () => {
  const alert = useSomeAlertLibrary();
  const form = usePersonPostForm({
    onSuccess: (successMessage) => alert.success(successMessage),
    onError: (error) => alert.error(error),
    validation: {
      firstName: [
        {
          rule: "minLength",
          value: 3,
        },
      ],
    },
  });

  return (
    <Form form={form}>
        <>
            <Input form={form} name="firstName" />
            <Input form={form} name="lastName" />
            <button type="submit" />
        <>
    </Form>
  );
};
```

Now form will not be sent, until firstName has minimum of 3 characters. justvalidate has plenty of rules builtin and you can even create your own. For more info check out there docs: https://just-validate.dev/documentation/.

#### Error handling

Its great, that you can be sure, that your form will not be sent, until it meets requirements. And with such little effort! But we of course need the possibility to show our user the error. Chisel hook form actually offers several ways how to do it. Each one for different types of errors.

##### All errors (not recomended for most cases)

You have the opportunity to handle all errors in a single way. While this is the most simple solution to code, its also the most unpractical from the point of the user. He will have to try to find the exact input, that will fit the global error message. Needless to say, that with many field errors the messages will become harder to read.

##### Global errors

If the api is for some reason unavailable, or some reason unavailable, chisel will return global error. For showing the error you can use any library/solution you want with onGlobalError callback:

```typescript
// PersonForm.tsx
const PersonForm: FunctionComponent = () => {
    const alert = useSomeAlertLibrary();
    const form = usePersonPostForm({
        onSuccess: (successMessage) => alert.success(successMessage),
        onGlobalError: (error) => alert.error(error);
    });

    return (
        <Form form={form}>
            <>
                <Input form={form} name="firstName" />
                <Input form={form} name="lastName" />
                <button type="submit" />
            </>
        </Form>
    )

}

```

##### Field errors

Field errors will be returned in case any validation for the field will failed, or chisel backend will returned error for specific field. In this case you can either handle them in similar way as globalErrors, or on the input level, or both at the same time. Both examples will look like this:

Input level:

```typescript
// Input.tsx
import { useChiselFormInput } from "@chisel-hooks/form";

interface Props {
  name: string;
}

export const Input: FunctionComponent<Props> = ({ name }) => {
  const { inputParams, errorMessage } = useChiselFormInput({ name });
  return (
    <div>
      <input {...inputParams} />
      <br />
      {errorMessage && <span>{errorMessage}</span>}
    </div>
  );
};
```

Global level:

```typescript
// PersonForm.tsx
const PersonForm: FunctionComponent = () => {
    const alert = useSomeAlertLibrary();
    const form = usePersonPostForm({
        onSuccess: (successMessage) => alert.success(successMessage),
        onFieldErrors: (fieldErrors) => fieldErrors.forEach(error => alert.error(error);
    )
    });

        return (
            <Form form={form}>
                <>
                    <Input form={form} name="firstName" />
                    <Input form={form} name="lastName" />
                    <button type="submit" />
                </>
            </Form>
        )

}

```

## Custom configuration

Chisel hooks can work without any other configuration needed, just from Chisel.toml file. However sometimes would be more usefull for project to change for example where the `chisel.hooks.ts` file will end up. Thats when chisel.hooks.config.ts comes to the game:

```typescript
// chisel.hooks.config.ts

export default {
    // path for generated file
    generateInto: 'some/other/directory/chisel.hooks.ts' // default 'chisel.hooks.ts'
    // if you have your own form implementation for forms, you probably dont need our form api. Although i would really much recomended to consider switch. Our form api works simple the best with chiselstrike framework.
    formApi: false // default true
    // Choose cache behavior. Possible values are `cache-and-fetch`, `cache-or-fetch`, `cache-only`, `fetch-ony`
    chache: 'fetch-only' // default 'cache-and-fetch'
    // Value in seconds until the cache is invalid.
    cacheInvalidationIn: 10000 // default 300 (5minutes)
}
```
