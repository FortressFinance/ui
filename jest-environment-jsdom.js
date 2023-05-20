"use strict"

// JSDOM does not play nicely with TextEncoder which is used in viem
// https://github.com/jsdom/jsdom/issues/2524#issuecomment-1480930523

import $JSDOMEnvironment, {
  TestEnvironment as JSDOMTestEnvironment,
} from "jest-environment-jsdom"
import { TextDecoder, TextEncoder } from "util"

export default class JSDOMEnvironment extends $JSDOMEnvironment {
  constructor(...args) {
    const { global } = super(...args)
    if (!global.TextEncoder) global.TextEncoder = TextEncoder
    if (!global.TextDecoder) global.TextDecoder = TextDecoder
  }
}

export const TestEnvironment =
  JSDOMTestEnvironment === $JSDOMEnvironment
    ? JSDOMEnvironment
    : JSDOMTestEnvironment
