import { Pressable, Text, View } from 'react-native';

type Props = { nota: number; onChange?: (n: number) => void };

export function Estrelas({ nota, onChange }: Props) {
  return (
    <View style={{ flexDirection: 'row' }} accessibilityLabel={`Nota ${nota} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable
          key={n}
          disabled={!onChange}
          onPress={() => onChange?.(n)}
          hitSlop={8}
          style={{ padding: 6 }}
          accessibilityRole="button"
          accessibilityLabel={`Dar nota ${n}`}
          accessibilityState={{ selected: n <= nota, disabled: !onChange }}
        >
          <Text style={{ fontSize: onChange ? 30 : 18, color: '#FFD54F' }}>{n <= nota ? '★' : '☆'}</Text>
        </Pressable>
      ))}
    </View>
  );
}
