const Redis = require('redis');
const RedisPublisher = require('ioredis');

class RedisPublisherSubscriber {

  constructor ({ server, channels }) {

    this.subscriber = Redis.createClient( server );

    this.publisher = new RedisPublisher( server );

    this.subscriber.on('message', ( channel, data ) => {

      if ( channels.hasOwnProperty( channel ) && typeof channels[ channel ] === 'function' ) {

        channels[ channel ]( data );

      }

    });

    for ( let channel in channels ) {

      this.subscriber.subscribe( channel );

    }

  }

  publish ( channel, data ) {

    this.publisher.publish( channel, data );

  }

}

module.exports = RedisPublisherSubscriber;
