var fs = require('fs');
var _ = require('lodash');
var Mustache = require('mustache');
var schema = require('resume-schema');

var d = new Date();
var curyear = d.getFullYear();

var resumeObject = schema.resumeJson;

function parseDate(date) {
	if (date && date.split) {
		date = date.split(/\D/);
	}
	return {
		year:  date && date[0] ? parseInt(date[0]) : null,
		month: date && date[1] ? parseInt(date[1]) : null,
		day:   date && date[2] ? parseInt(date[2]) : null
	};
}

var months = 'January February March April May June July August September October November December'.split(' ');
function getMonth(index) {
	return months[index - 1];
}

function render(resumeObject) {
	if (resumeObject.basics.email) {
		resumeObject.emailBool = true;
	}
	
	if (resumeObject.basics.phone) {
		resumeObject.phoneBool = true;
	}
	
	if (resumeObject.basics.website) {
		resumeObject.websiteBool = true;
	}
	
	if (resumeObject.basics.summary) {
		resumeObject.aboutBool = true;
	}
	
	if (resumeObject.basics.profiles) {
		if (resumeObject.basics.profiles[0] && resumeObject.basics.profiles[0].network) {
			_.each(resumeObject.basics.profiles, function(w) {
				if (w.network && !w.url && w.username) {
					switch (w.network.toLowerCase()) {
						case 'twitter':
							w.url = 'https://twitter.com/' + w.username;
							break;
						case 'facebook':
							w.url = 'https://facebook.com/' + w.username;
							break;
						case 'linkedin':
							w.url = 'https://linkedin.com/in/' + w.username;
							break;
					}
				}
			});
		}
	}
	
	if (resumeObject.work) {
		if (resumeObject.work[0] && resumeObject.work[0].company) {
			resumeObject.workBool = true;
			_.each(resumeObject.work, function(w) {
				var date;
				if (w.startDate) {
					date = parseDate(w.startDate);
					w.startDateYear = date.year || '';
					if (date.month) {
						w.startDateMonth = getMonth(date.month) + ' ';
					}
				}
				if (w.endDate) {
					date = parseDate(w.endDate);
					w.endDateYear = date.year || '';
					if (date.month) {
						w.endDateMonth = getMonth(date.month) + ' ';
					}
				}
				else { 
					w.endDateYear = 'Present';
				}
				if (w.highlights && w.highlights[0] && w.highlights[0] !== '') {
					w.workHighlights = true;
				}
			});
		}
	}
	
	if (resumeObject.education) {
		if (resumeObject.education[0] && resumeObject.education[0].institution) {
			resumeObject.educationBool = true;
			_.each(resumeObject.education, function(e) {
				var date;
			    if (!e.area || !e.studyType) {
					e.educationDetail = (e.area || '') + (e.studyType || '');
			    }
				else {
					e.educationDetail = e.area + ', ' + e.studyType;
			    }
				if (e.startDate) {
					date = parseDate(e.startDate);
					e.startDateYear = date.year || '';
					if (date.month) {
						e.startDateMonth = getMonth(date.month) + ' ';
					}
				}
				if (e.endDate) {
					date = parseDate(e.endDate);
					e.endDateYear = date.year || '';
					if (date.month) {
						e.endDateMonth = getMonth(date.month) + ' ';
					}
					if (e.endDateYear > curyear) {
						e.endDateYear += ' (expected)';
					}
				}
				else { 
					e.endDateYear = 'Present';
					e.endDateMonth = '';
				}
				if (e.courses && e.courses[0] && e.courses[0] !== '') {
					e.educationCourses = true;
				}
			});
		}
	}
	
	if (resumeObject.awards) {
		if (resumeObject.awards[0] && resumeObject.awards[0].title) {
			resumeObject.awardsBool = true;
			_.each(resumeObject.awards, function(a) {
				var date = parseDate(a.date);
				a.year = date.year || '';
				if (date.month) {
					a.month = getMonth(date.month);
				}
				a.day = date.day || '';
			});
		}
	}
	
	if (resumeObject.publications) {
		if (resumeObject.publications[0] && resumeObject.publications[0].name) {
			resumeObject.publicationsBool = true;
			_.each(resumeObject.publications, function(a) {
				var date = parseDate(a.releaseDate);
				a.year = date.year || '';
				if (date.month) {
					a.month = getMonth(date.month);
				}
				a.day = date.day || '';
			});
		}
	}
	
	if (resumeObject.skills) {
		if (resumeObject.skills[0] && resumeObject.skills[0].name) {
			resumeObject.skillsBool = true;
		}
	}
	
	if (resumeObject.interests) {
		if (resumeObject.interests[0] && resumeObject.interests[0].name) {
			resumeObject.interestsBool = true;
		}
	}
	
	if (resumeObject.languages) {
		if (resumeObject.languages[0] && resumeObject.languages[0].language) {
			resumeObject.languagesBool = true;
		}
	}
	
	if (resumeObject.references) {
		if (resumeObject.references[0] && resumeObject.references[0].name) {
			resumeObject.referencesBool = true;
		}
	}
	
	var theme = fs.readFileSync(__dirname + '/resume.template', 'utf8');
	var resumeHTML = Mustache.render(theme, resumeObject);
	
	return resumeHTML;
}
module.exports = {
	render: render
};
