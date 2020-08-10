const PRETTY_INDENT = 2;
const adaptiveCardSerializer: jest.SnapshotSerializerPlugin = {
    test(value): boolean {
        return typeof value === "object" && value.type === "AdaptiveCard";
    },
    print(value): string {
        return JSON.stringify(value, null, PRETTY_INDENT);
    }
};

module.exports = adaptiveCardSerializer;