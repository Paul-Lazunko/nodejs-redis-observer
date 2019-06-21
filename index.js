const Redis = require('redis');
const RedisPublisher = require('ioredis');

class RedisPublisherSubscriber {

  constructor ({ server }) {

    this.callbacks = {};

    this.subscriber = Redis.createClient( server );

    this.publisher = new RedisPublisher( server );

    this.subscriber.on('message', ( channel, data ) => {

      if ( this.callbacks.hasOwnProperty( channel ) && Array.isArray( this.callbacks[ channel ]) ) {

        for ( let i=0; i < this.callbacks[channel].length; i++ ) {
          if ( typeof this.callbacks[ channel ][ i ] === 'function' ) {
            this.callbacks[ channel ][ i ]( data );
          }
        }

      }

    });

  }

  subscribe ( channel, callback ) {

    if ( typeof channel === 'string' && typeof callback === 'function' ) {

      this.subscriber.subscribe( channel );

      this.callbacks[ channel ] = this.callbacks[ channel ] || [];
      this.callbacks[ channel ].push( callback.bind( this.callbacks ) );

    }

  }

  publish ( channel, data ) {

    this.publisher.publish( channel, data );

  }

}

module.exports = RedisPublisherSubscriber;
