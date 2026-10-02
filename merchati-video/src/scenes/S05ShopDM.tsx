import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BEATS, GRADIENTS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {DMItem, DMThread, nodeItem, textItem, typingItem} from '../components/DMThread';
import {FloatChip} from '../components/FloatChip';
import {KineticText} from '../components/KineticText';
import {ORDER_RECAP_H, OrderRecap} from '../components/OrderRecap';
import {PhoneFrame} from '../components/PhoneFrame';
import {PRODUCT_CARDS_H, ProductCards} from '../components/ProductCards';
import {VOICE_NOTE_H, VoiceNote} from '../components/VoiceNote';
import {UI_STACK} from '../fonts';
import {SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.shopDM;
const C = COPY.shopDM;
const T = 'instagram' as const;

const items: DMItem[] = [
  nodeItem('stamp', 'center', 0, 22, () => (
    <div style={{fontFamily: UI_STACK, fontSize: 12.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600}}>Aujourd’hui 20:12</div>
  )),
  textItem('c1', 'me', C.customer1, B.msgCustomer1, T),
  typingItem('t1', B.typing1[0], B.typing1[1], T),
  textItem('a1', 'them', C.ai1, B.msgAI1, T),
  nodeItem('cards', 'them', B.cards, PRODUCT_CARDS_H, () => <ProductCards swipe={B.swipe} width={330} />),
  textItem('c2', 'me', C.customer2, B.msgCustomer2, T),
  typingItem('t2', B.typing2[0], B.typing2[1], T),
  textItem('a2', 'them', C.ai2, B.msgAI2, T),
  textItem('c3', 'me', C.customer3, B.msgCustomer3, T),
  typingItem('t3', B.typing3[0], B.typing3[1], T),
  nodeItem('recap', 'them', B.recap, ORDER_RECAP_H, () => <OrderRecap />),
  textItem('c4', 'me', C.customer4, B.msgCustomer4, T),
  typingItem('t4', B.typing4[0], B.typing4[1], T),
  textItem('a3', 'them', C.ai3, B.msgAI3, T),
  nodeItem('voice', 'me', B.voice, VOICE_NOTE_H, () => <VoiceNote play={B.voicePlay} transcriptAt={B.transcript} />),
  typingItem('t5', B.typing5[0], B.typing5[1], T),
  textItem('a4', 'them', C.ai4, B.msgAI4, T),
];

export const S05ShopDM: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const intro = sp(f, 0, SPRINGS.smooth);
  const phoneX = L.phoneCx - L.phoneW / 2;
  const heads = [
    {lines: C.headline1, at: B.headline1, out: B.headline1Out},
    {lines: C.headline2, at: B.headline2, out: B.headline2Out},
    {lines: C.headline3, at: B.headline3, out: undefined},
  ];

  return (
    <AbsoluteFill>
      <Background variant="brand" />
      <div style={{position: 'absolute', left: phoneX, top: L.phoneTop + (1 - intro) * 60, opacity: intro}}>
        <PhoneFrame width={L.phoneW} time="20:12">
          <DMThread
            theme={T}
            name={C.shopName}
            sub={C.shopHandle}
            avatar={{initials: 'ML', bg: GRADIENTS.igIcon}}
            items={items}
            composer={C.composer}
          />
        </PhoneFrame>
      </div>
      {L.square ? (
        <>
          <div style={{position: 'absolute', left: L.text.x, top: 330}}>
            {heads.map((h, i) => (
              <div key={i} style={{position: 'absolute', left: 0, top: 0}}>
                <KineticText lines={h.lines} at={h.at} out={h.out} size={L.headlineSize} width={L.text.w} />
              </div>
            ))}
          </div>
          <div style={{position: 'absolute', left: L.text.x, top: 640}}>
            <FloatChip text={C.badge} at={B.msgAI1 + 8} size={22} />
          </div>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: L.text.x, top: L.text.y + 10}}>
            {heads.map((h, i) => (
              <div key={i} style={{position: 'absolute', left: 0, top: 0}}>
                <KineticText lines={h.lines} at={h.at} out={h.out} size={L.headlineSize} width={L.text.w} />
              </div>
            ))}
          </div>
          <div style={{position: 'absolute', left: 0, width: L.W, top: 448, display: 'flex', justifyContent: 'center'}}>
            <FloatChip text={C.badge} at={B.msgAI1 + 8} size={30} />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
