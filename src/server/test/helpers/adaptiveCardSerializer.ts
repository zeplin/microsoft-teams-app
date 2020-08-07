const PRETTY_INDENT = 4;
const adaptiveCardSerializer: jest.SnapshotSerializerPlugin = {
    test(value): boolean {
        return typeof value === "object" && value.type === "AdaptiveCard";
    },
    print(value, _, indent): string {
        return indent(JSON.stringify(value, null, PRETTY_INDENT));
    }
};

module.exports = adaptiveCardSerializer;