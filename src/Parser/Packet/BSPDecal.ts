import {BSPDecalPacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';
import {Vector} from "../../Data/Vector";

const getCoord = function (stream) {
	const hasInt   = !!stream.readBits(1);
	const hasFract = !!stream.readBits(1);
	let value      = 0;
	if (hasInt || hasFract) {
		const sign = !!stream.readBits(1);
		if (hasInt) {
			value += stream.readBits(14) + 1;
		}
		if (hasFract) {
			value += stream.readBits(5) * (1 / 32);
		}
		if (sign) {
			value = -value;
		}
	}
	return value;
};

const getVecCoord = function (stream): Vector {
	const hasX = !!stream.readBits(1);
	const hasY = !!stream.readBits(1);
	const hasZ = !!stream.readBits(1);
	return {
		x: hasX ? getCoord(stream) : 0,
		y: hasY ? getCoord(stream) : 0,
		z: hasZ ? getCoord(stream) : 0
	}
};

export function BSPDecal(stream: BitStream): BSPDecalPacket { // 21: BSPDecal
	let modelIndex, entIndex;
	const position     = getVecCoord(stream);
	const textureIndex = stream.readBits(9);
	if (stream.readBits(1)) {
		entIndex   = stream.readBits(11);
		modelIndex = stream.readBits(12);
	}
	const lowPriority = stream.readBoolean();
	return {
		packetType:   'bspDecal',
		position:     position,
		textureIndex: textureIndex,
		entIndex:     entIndex,
		modelIndex:   modelIndex,
		lowPriority:  lowPriority
	}
}
