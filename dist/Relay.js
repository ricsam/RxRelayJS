"use strict";
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const rxSubscriber_1 = require("rxjs/symbol/rxSubscriber");
const Subscriber_1 = require("rxjs/Subscriber");
const Subscription_1 = require("rxjs/Subscription");
const Observable_1 = require("rxjs/Observable");
const RelaySubscription_1 = require("./RelaySubscription");
/**
 * Emits all subsequent events to observers once they have subscribed.
 * @class RelaySubscriber<T>
 */
class RelaySubscriber extends Subscriber_1.Subscriber {
    constructor(destination) {
        super(destination);
        this.destination = destination;
    }
}
/**
 * @class Relay<T>
 */
class Relay extends Observable_1.Observable {
    constructor() {
        super();
        this.observers = [];
    }
    [rxSubscriber_1.rxSubscriber]() {
        return new RelaySubscriber(this);
    }
    lift(operator) {
        const relay = new AnonymousRelay(this, this);
        relay.operator = operator;
        return relay;
    }
    next(value) {
        const { observers } = this;
        const len = observers.length;
        const copy = observers.slice();
        for (let i = 0; i < len; i++) {
            copy[i].next(value);
        }
    }
    error(err) {
        // Ignore
    }
    complete() {
        // Ignore
    }
    _subscribe(subscriber) {
        this.observers.push(subscriber);
        return new RelaySubscription_1.RelaySubscription(this, subscriber);
    }
    asObservable() {
        const observable = new Observable_1.Observable();
        observable.source = this;
        return observable;
    }
}
Relay.create = (destination, source) => {
    return new AnonymousRelay(destination, source);
};
exports.Relay = Relay;
/**
 * @class AnonymousRelay<T>
 */
class AnonymousRelay extends Relay {
    constructor(destination, source) {
        super();
        this.destination = destination;
        this.source = source;
    }
    next(value) {
        const { destination } = this;
        if (destination && destination.next) {
            destination.next(value);
        }
    }
    _subscribe(subscriber) {
        const { source } = this;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription_1.Subscription.EMPTY;
        }
    }
}
exports.AnonymousRelay = AnonymousRelay;
//# sourceMappingURL=Relay.js.map