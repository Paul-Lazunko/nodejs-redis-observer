const Redis = require('redis');
const RedisPublisher = require('ioredis');

class RedisPublisherSubscriber {

  constructor ({ server, channels }) {

    this.callbacks = channels;

    this.subscriber = Redis.createClient( server );

    this.publisher = new RedisPublisher( server );

    this.subscriber.on('message', ( channel, data ) => {

      if ( this.callbacks.hasOwnProperty( channel ) && typeof this.callbacks[ channel ] === 'function' ) {

        this.callbacks[ channel ]( data );

      }

    });

    for ( let channel in channels ) {

      this.subscriber.subscribe( channel );

    }

  }

  subscribe ( channel, callback ) {

    if ( typeof channel === 'string' && typeof callback === 'function' ) {

      this.subscriber.subscribe( channel );

      this.callbacks[ channel ] = callback.bind( this.callbacks );

    }

  }

  publish ( channel, data ) {

    this.publisher.publish( channel, data );

  }

}

module.exports = RedisPublisherSubscriber;
