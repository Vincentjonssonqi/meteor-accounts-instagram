Instagram = {};

Instagram.requestCredential = function (options, credentialRequestCompleteCallback) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'instagram'});
  if (!config) {
    if(credentialRequestCompleteCallback) credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
    return;
  }
  var credentialToken = Random.secret();
  var loginStyle = OAuth._loginStyle('instagram', config, options);
	console.log(config);
  var scope = config.hasOwnProperty('scope')? config.scope:['basic', 'likes', 'relationships', 'comments'];
	console.log(scope);
	var flatScope = _.map(scope, encodeURIComponent).join('+');

  var loginUrl =
    'https://instagram.com/oauth/authorize' +
      '?client_id=' + config.clientId +
      '&response_type=code' +
      '&scope=' + flatScope +
      '&redirect_uri=' + OAuth._redirectUri('instagram', config) +
      '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: "instagram",
		loginStyle: loginStyle,
		loginUrl: loginUrl,
		credentialRequestCompleteCallback: credentialRequestCompleteCallback,
		credentialToken: credentialToken
  });
};
