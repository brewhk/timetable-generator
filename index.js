var standardizeDay = function (day) {
	let standardDay;
	// If cannot be converted into a number, process as string
	if(isNaN(parseInt(day))) {
		if(typeof day === "string") {
			const dayCode = day.substring(0, 3).toLowerCase();
			switch (dayCode) {
				case "sun":
					standardDay = 0;
					break;
				case "mon":
					standardDay = 1;
					break;
				case "tue":
					standardDay = 2;
					break;
				case "wed":
					standardDay = 3;
					break;
				case "thu":
					standardDay = 4;
					break;
				case "fri":
					standardDay = 5;
					break;
				case "sat":
					standardDay = 6;
					break;
				default:
					throw new Meteor.Error(400, 'Error 400: Bad Request', "One of the 'day' values is not given or is in an unrecognized format. The script will continue execution using the default value.");
			}
		} else {
			throw new Meteor.Error(400, 'Error 400: Bad Request', "One of the 'day' values is not given or is in an unrecognized format. The script will continue execution using the default value.");
		}
	}
	// If day can be converted to a number, process as number
	else {
		standardDay = parseInt(day) % 7;
	}
	return standardDay;
}

var standardizeHour = function (hour) {
	let standardHour = parseInt(hour);
	if (isNaN(standardHour)) {
		throw new Meteor.Error(400, 'Error 400: Bad Request', "One of the 'hour' values is not given or is in an unrecognized format. The script will continue execution using the default value.");
	} else {
		return standardHour;
	}
}

let stardardDayToText = function (standardDay) {
	switch (standardDay) {
		case 0:
			return "Sunday";
			break;
		case 1:
			return "Monday";
			break;
		case 2:
			return "Tuesday";
			break;
		case 3:
			return "Wednesday";
			break;
		case 4:
			return "Thursday";
			break;
		case 5:
			return "Friday";
			break;
		case 6:
			return "Saturday";
			break;
		default:
			break;
	}
};

let stardardDayToShortText = function (standardDay) {
	return stardardDayToText(standardDay).substring(0,3);
};

let stardardDayToLetter = function (standardDay) {
	return stardardDayToText(standardDay).substring(0,1);
};

var countInBetweenDays = function (startDay, endDay) {
	let temp = standardizeDay(endDay) - standardizeDay(startDay) + 1;
	return temp > 0 ? temp : temp + 7;
};

var countInBetweenHours = function (startHour, endHour) {
	return Math.abs(standardizeHour(endHour) - standardizeHour(startHour)) + 1;
};

var generateWeekTable = function (options) {
	let inBetweenHours = countInBetweenHours(options.dayStart, options.dayEnd);
	let standardDayStart = standardizeHour(options.dayStart);

	let table = document.createElement('table');
	if(options.id) {
		table.id = options.id;
	}
	if(options.class) {
		table.className = options.class;
	}

	let tr = table.insertRow(0);
	tr.insertCell(0);
	for (let i = 0; i < inBetweenHours; i++) {
		let td = tr.insertCell(i + 1);
		td.appendChild(document.createTextNode(standardDayStart + i));
	}

	for (let i = 0; i < countInBetweenDays(options.weekStart, options.weekEnd); i++) {
		let tr = table.insertRow(i + 1);
		let td = tr.insertCell(0);
		let standardizedWeekStart = standardizeDay(options.weekStart + i);
		td.appendChild(document.createTextNode(stardardDayToShortText(standardizedWeekStart)));
		for (let j = 0; j < inBetweenHours; j++) {
			let td = tr.insertCell(j + 1);
			if(options.buttons) {
				let toggleButton = document.createElement('button');
				toggleButton.className = options.buttonClass;
				toggleButton.dataset.day = standardizedWeekStart;
				toggleButton.dataset.hour = standardDayStart + j;
				td.appendChild(toggleButton);
			}
		}
	}
	return table;
}

exports.Timetable = class Timetable {
	constructor (options) {
		if (options.weekStart) {
			options.weekStart = standardizeDay(options.weekStart)
		}
		if (options.weekEnd) {
			options.weekEnd = standardizeDay(options.weekEnd)
		}
		this.options = options;
	}

	static getData (table) {
		// foreach row, put true/false values in object
	}

	generateTable () {
		if (this.options.template === "week") {
			return generateWeekTable(this.options);
		}
		return "This template is not supported yet.";
	}

	generateTableAsHTML () {
		let tableObj = this.generateTable();
		return tableObj.outerHTML;
	}
}