
//GET locations page, home page
module.exports.locations = function (req, res) {
	var locations = [
		{
			name: 'Starcups',
			rating: 3,
			distance: '100m',
			address: '125 High Street, Reading RG6 1PS',
			facilities: ['Hot drinks', 'Food', 'Premium wifi']
		},
				{
			name: 'Cafe Hero',
			rating: 4,
			distance: '200m',
			address: '125 Low Street, Reading RG9 2PS',
			facilities: ['Hot drinks', 'Food', 'Premium wifi']
		},
				{
			name: 'Burger Queen',
			rating: 2,
			distance: '250m',
			address: '2 Fun Street, RG69 3PS',
			facilities: ['Food', 'Premium wifi']
		}
	];

	res.render('locations', { 
		pageHeader: {
			title: 'Loc8r',
			strapLine: 'Find places to work with wifi near you!' 
		},
		locations: locations,
		sidebar: "Looking for wifi and a seat? Loc8r helps you find places"
		 + "to work when you and about.Perhaps with coffee, cake or a pint?"
		 + "Let Loc8r help you find the place you're looking for."
	});
};

//GET location page
module.exports.location = function (req, res) {
	var map = {
		coordinates: {lat: 51.455041, lng: -0.9690884},
		zoom: 17,
		size: '400x350',
		sensor: false,
		scale: 2
	}

	var reviews = [
		{
			rating: 5,
			author: 'Jason Brady',
			date: '31 August 2016',
			comment: "What a great place. I can't say enough good things about it."
		},
		{
			rating: 3,
			author: 'Amanda Brady',
			date: '19 June 2016',
			comment: "It was okay. Coffee wasn't great, but the wifi was fast."
		},
	];
	var location = {
		name: 'Starcups',
		rating: 3,
		distance: '100m',
		address: '125 High Street, Reading RG6 1PS',
		facilities: ['Hot drinks', 'Food', 'Premium wifi'],
		hours: ['Monday - Friday: 7:00am - 7:00pm', 'Saturday : 8:00am - 5:00pm', 'Sunday : closed'],
		reviews: reviews,
		map: map
	};

	res.render('location', {
		pageHeader: {
			title: 'Starcups'
		},
		location: location,
		sidebar: {
			context: "Starcups cafe is on Loc8r because it has accessible wifi and space to.sit down with your laptop and get some work done.",
			callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
		}
	});	
};

//GET add review page
module.exports.newReview = function (req, res) {
	res.render('newReview', { 
		title: 'Review Starcups on Loc8r',
		pageHeader: {title: 'Review Starcups'}
	});	
};