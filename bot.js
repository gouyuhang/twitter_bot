var Twit = require('twit')

var T = new Twit({
  consumer_key: 'your_consumer_key',
  consumer_secret: 'your_consumer_secret',
  access_token: 'your_access_token',
  access_token_secret: 'your_access_token_secret',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true, 
})
var stream = T.stream('statuses/filter', { follow: 'your_twitter_id' })

stream.on('tweet', function (tweet) {
  // Who is this in reply to?
  var reply_to = tweet.in_reply_to_screen_name
  // Who sent the tweet?
  var name = tweet.user.screen_name
  // What is the text?
  var txt = tweet.text

  // Ok, if this was in reply to me
  // Replace selftwitterhandle with your own twitter handle
  console.log(reply_to, name, txt)
  console.log(tweet)
  
  if (reply_to === 'your_user_name') {

    // Get rid of the @ mention
    txt = txt.replace(/@your_user_name/g, '')

    // Start a reply back to the sender
    var reply = 'Hi @' + name + ' ' + ', Thanks for the mention :)'+txt

    console.log(reply)
    // Post that tweet!
    T.post('statuses/update', 
    { in_reply_to_status_id:tweet.id_str,status: reply }, tweeted)
  }
  
})

// Make sure it worked!
function tweeted (err, reply) {
  if (err !== undefined) {
    console.log(err)
  } else {
    console.log('Tweeted: ' + reply)
  }
}
var hastagSearch = { q: '#JoeBiden', count: 10, result_type: 'recent' }
function retweetLatest () {
  T.get('search/tweets', hastagSearch, function (error, data) {
    var tweets = data.statuses
    for (var i = 0; i < tweets.length; i++) {
      console.log(tweets[i].text)
    }
    // If our search request to the server had no errors...
    if (!error) {
      // ...then we grab the ID of the tweet we want to retweet...
      var retweetId = data.statuses[0].id_str
      // ...and then we tell Twitter we want to retweet it!
      T.post('statuses/retweet/' + retweetId, {}, tweeted)
    }
    // However, if our original search request had an error, we want to print it out here.
    else {
      if (debug) {
        console.log('There was an error with your hashtag search:', error)
      }
    }
  })
}
retweetLatest()
setInterval(retweetLatest, 1000 * 60 * 12)
