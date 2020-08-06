# Deviget Frontend Test

![Node.js CI](https://github.com/pablen/deviget-reddit-client/workflows/Node.js%20CI/badge.svg?branch=master)

Demo: [http://deviget-reddit-client.vercel.app/](http://deviget-reddit-client.vercel.app/)

## Technical description

### Stack

- **create-react-app**

  For small (and not-so-small) projects I find [create-react-app](https://github.com/facebook/create-react-app) quite useful, with **good defaults** and already configured dependencies. Even when some additional tweaking is required, I've found some tools like [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) to be very versatile and help you avoid ejecting the project. Of course, if very specific fine-tuning is required you can always eject and tweak as you need.

- **TypeScript**

  Nowadays I think of TypeScript or some sort of static typing to be a must for any new project. It helps you **avoid the dreadful `TypeError` bugs** so common in frontend projects and also work as a **layer of documentation** in your code. If correctly integrated with your IDE it will also be of great **assistance while you write code**, displaying inline warnings, in-place documentation and smarter IntelliSense/auto-complete.

- **Redux**

  I've used Redux in several projects with great results, but I prefer to take a somewhat **conservative approach** with it, storing only "global" data that really need to be accessed in different parts of the app. I will go into more detail about this in the following section.

- **CSS Modules**

  I think I've used every alternative of styling techniques in my career. Any tool that allows you to **encapsulate styles and keep low CSS specificity** is fine for me. In this case I used CSS Modules because it has those features and is already integrated into Create React App.

- **Framer Motion**

  For animations I used [Framer Motion](https://www.framer.com/motion/) because it works really well and is super **easy to implement with a minimal amount of code**. To be honest, it might be a bit of an overkill for the simple animations required in this app, but it has a lot of nifty features that would come handy as a project scales.

- **Cypress**

  Frontend testing in general, and browser automation in particular, is always tricky. Nonetheless, I personally believe that **real end-to-end testing is the way to go for frontend apps**. [Cypress](https://www.cypress.io/) is a tool that greatly helps with that and is really simple to write tests with, runs locally and also can run on your CI.

- **GitHub Actions & Vercel**

  Using GitHub Actions and Vercel integration for CI and CD on this kind of projects is a no brainer. Both services are **fully integrated with each other**, are free and work well. I like to configure these tools early in the project so that any code that breaks the build or breaks the tests suite is detected on the spot even if the offending commit is pushed overriding local hooks.

- **Other development environment tools:** (ESLint, Prettier, Husky)

  Code linting for me is a must. In general I use the recommended configs with only a few tweaks. Prettier, I personally like it a lot and saves me a ton of keystrokes everyday. I also use Husky for configuring Git hooks: TypeScript compilation on pre-commit and running tests on pre-push. All of these tools should be **installed locally in the project and not globally** in order to make sure every developer uses the correct version of each tool.

### Implementation Notes

#### Files and folder structure

I went for a simple file organization, with only a `components` folder for React components (with their related styles and tests) and the rest of utility files in the `src` directory. As a project scales it makes sense to organize things a bit more (e.g. breaking the reducer function into smaller sub-reducers), but when a project is in its infancy I prefer to **start simple and let the required structure become apparent** once there is a lot of duplication or components become very complex. Forcing a specific structure from the very beginning can hurt the project in the long run if early assumptions were incorrect.

#### Redux implementation

##### A conservative approach

As mentioned in the previous section I used a conservative approach towards Redux, meaning not every single piece of state is in the Redux store. In my opinion, some UI-related state such as a modal window being displayed or hidden **belongs to the specific component or page that is dealing with it and not a global store**. In such cases, going "Full Redux" would require dispatching actions for closing a modal when the user navigates out of a page or clearing a form state when mounting the form component which is always awkward and feels redundant. I believe those things are better handled in the own component state, which saves you from keeping the store in-sync by hand.

##### Async requests state

The same concept applies to async requests state. An async request being pending, or displaying an error message if it failed is in general only relevant on the component that triggered the request in the first place, so there's no use in storing all of that in the Redux Store. That's why I prefer to deal with the async calls, the pending state and optional error messages in the components and **only trigger a Redux action to store valid responses**, which might be needed in several places. This approach also makes using async middlewares unnecessary as you only dispatch synchronous actions. All this might make unit testing more awkward but, as mentioned before, I prioritize end-to-end over unit testing for thorough and reliable testing.

##### Lack of action creators or action type constants

Another of the known Redux community conventions I don't necessarily follow nowadays is writing action creator functions or defining action type constants. The reason for this is that these things are intended to create valid, well-formed action objects and prevent bugs caused by misspelled action types or incorrectly shaped payloads and **this is exactly what TypeScript allows you to do if you define a strict exhaustive type of all possible actions**. Not only the TS compiler will not allow you to dispatch an invalid action, but also the IDE will assist you with auto-complete when writing a `dispatch()` call or when handling a certain action type inside the reducer.

##### Hooks API

I leverage the hooks API across the board and `react-redux` is no exception so I used `useSelector` hook instead of `connect`. As the store shape is so minimal the selectors are just inline functions. I think there is no use for a library such as [reselect](https://github.com/reduxjs/reselect) for memoizing results in this case.

##### State Persistance

I used the browser LocalStorage for persisting part of the store state between sessions. **The only piece of data that is persisted is the set of post the user already read** as I think it's the only thing that makes sense to persist given the Reddit API. At first I thought persisting the list of posts would be a good idea, making it possible to also implement some offline browsing capabilities, but given that the `/top` API endpoint returns a very dynamic list of posts that you can only paginate by requesting the first page and then requesting additional pages using the `after` request parameter, **keeping a local copy in-sync and fetching only "new" posts not already cached would be no simple task** and may require a more complex API.

#### Styling & Responsiveness

**I followed the demo video layout as a reference**, with minimal changes in colors and sizes. No reason for that but personal taste. **Post rows vary on height** because Reddit titles can be quite long (350 chars!) and they were required to be displayed in full so having equal size rows would imply mostly empty huge rows just to support the worst case scenario.

A small deviation from the demo video is the fact that I included a "sidebar toggle" button for narrow viewports instead of the "swipe from the left" gesture depicted in the video. The reason for this is that in some mobile browsers (such as iOS browsers) **the "swipe from the left" gesture is reserved for navigating back**, and it would be in conflict with our "reveal sidebar" interaction.

I used CSS Modules to style the app with almost no global styles. **CSS custom properties were used as a means to define a theme** of values that could be used everywhere. **I used a [Mobile First](https://www.lukew.com/ff/entry.asp?933) approach** in which the base styles are appropriate for mobile (narrow viewport) devices and additional styles are applied via media queries for wider viewports. For this simple layout there's no much gain in doing it this way but for real-world apps it's helpful to think of styling Mobile First as it's generally easier to think the simpler, more limited layout first and then approach the other variants as "enhancements" instead of going for the full-featured version first and then "cut" or limit the experience for smaller viewports.

#### Testing

As stated before, for frontend code I prefer completely end-to-end tests over unit or integration tests because of the guarantees they provide. The results are almost identical to those real users will be getting from the app so **a passing end-to-end test suite is a very strong guarantee that your app will work on production**, as it even hits the remote API and deals with real world data. As a cons, they can be a bit brittle as even slow API responses might trigger a timeout and make tests fail, but these false positives are easy to spot and are compensated by the fact that you don't need to write too many tests.

In my experience, there's no much use in unit testing a reducer or snapshot testing a complex component. You will need to update them very frequently and a passing suite is not really a strong guarantee that the app will work in production. That said, if given a bit more of time I would probably write a few more integration tests.

#### ServiceWorker and PWA features

I enabled the simple Service Worker implementation that Create React App brings out of the box. This allows browsers to **cache the static assets locally so that the app loads faster the next time a user visits it** or even makes it work offline, although the remote requests would not work in that case so in the current state the app is not really usable offline.

### TODOs and possible enhancements

A few things that could be improved if given more time:

1. **Infinite scroll for the posts list** and/or better handling of scroll position when appending posts to the list.
2. **Post list virtualization/windowing** because performance can suffer when rendering too many posts at the same time and animations could start to feel janky, a library such as [react-virtualized](https://github.com/bvaughn/react-virtualized) could be leveraged to help with that.
3. **Custom Service Worker code for API responses and media caching** leveraging IndexedDB and figuring out a way to cache posts given the current API we could provide _offline first_ capabilities and allow a user to browse already downloaded posts even when offline.
4. **More tests** (both e2e and integration) could be written, e.g. test the responsive behaviour for different viewport sizes.
5. **Provide user feedback/confirmation** such as toast notifications when there was an error or require user confirmation before dismissing all posts.
6. **Better accessibility** e.g. improving keyboard navigation is possible.

## Installation and running in development mode

```
$ npm i
$ npm start
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run test`

Launches the test runner in the interactive watch mode.<br />

### `npm run build`

Builds the app for production to the `build` folder.<br />

### `npm run cypress`

Launches the end-to-end test runner in the interactive watch mode.<br />

1. First you need to run the app locally:

```
$ npm run start
```

2. Verify the local URL matches the `baseUrl` value defined in `cypress.json`.
3. Run Cypress.

```
$ npm run cypress
```

4. Run the tests by clicking the _Run all specs_ button.
