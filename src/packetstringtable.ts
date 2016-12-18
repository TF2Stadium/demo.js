export class PacketStringTable {
	constructor(stream) {
		this.stream = stream;
		this.id = PacketStringTable.tables.length;
		this.strings = [];
		this.numEntries = 0;
		this.name = '';
		PacketStringTable.tables.push(this);
	}

	parse() {
		//todo
		// https://coldemoplayer.googlecode.com/svn/branches/2.0/code/plugins/CDP.Source/Messages/SvcCreateStringTable.cs
		this.stream._index = this.stream._view._view.length * 8;
		return {
			packetType: 'stringTableTODO'
		};
		//return this.searchIds();
	}

	parsePlayerInfo() {
		console.log('name: ' + this.stream.readUTF8String());
	}

// "fuckit" parsing, look for anything that looks like a steam id, user id is the 32 bit before that
	searchIds() {
		var validChar = function (charCode) {
			return charCode === 91 || charCode === 93 || charCode === 58 || (charCode > 47 && charCode < 58); // [ ] : 0-9
		};
		var users = {};
		var numFound = 0;
		while (true) {
			var found = false;
			while (this.stream._index < ((this.stream._view._view.length - 1) * 8)) {
				var startPos = this.stream._index;
				try {
					if (this.stream.readASCIIString(3) === '[U:') {
						found = true;
						break;
					}
					this.stream._index = startPos + 1;
				} catch (e) {
					break;
				}
			}
			if (!found) {
				if (numFound) {
					//console.log(users);
				}
				this.stream._index = this.stream._view._view.length * 8;
				return users;
			}
			while (validChar(this.stream.readBits(8))) {
				// seek
			}
			var endPos = this.stream._index - 8;
			var length = (endPos / 8) - (startPos / 8);
			this.stream._index = startPos - 32;
			var userId = this.stream.readBits(32);
			var steamId = this.stream.readASCIIString(length);
			if (steamId[steamId.length - 1] !== ']') {
				steamId += ']';
			}
			users[userId] = steamId;
			numFound++;
		}
	}
}

PacketStringTable.tables = [];
