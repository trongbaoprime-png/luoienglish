# LƯỜI ENGLISH — Chú Lười Character Production Specification

> **Mascot Identity**: Chú Lười (The Friendly Learning Sloth)  
> **Role**: Emotional Companion, Cheerful Mentor, Reassuring Peer Learner  
> **Personality**: Patient, kind, joyful, slightly clumsy, always proud of the child's efforts.

---

## 1. Character Proportions & Model Sheet

- **Head-to-Body Ratio**: 1:1.5 (Chibi / child-proportioned for high emotional resonance).
- **Face**:
  - Soft tan/cream mask marking across the eyes.
  - Large, round, sparkling dark coffee eyes with double specular highlights.
  - Cute warm brown triangular nose and friendly curved smile.
- **Body**:
  - Fluffy, round silhouette with warm beige/brown fur.
  - Soft curved paws with 3 rounded, harmless claws (used for climbing branches and holding pencils).
- **Icon Scale Legibility**:
  - The head silhouette and eye shape must remain clearly recognizable at small avatar sizes ($32\text{px} \times 32\text{px}$).

---

## 2. Semantic Character Poses & States (22 Core States)

| Pose Key | Name | Visual Description | Usage Context |
| :--- | :--- | :--- | :--- |
| `IDLE` | Thư giãn | Gentle breathing on branch, subtle smile | Default standby |
| `BLINK` | Chớp mắt | Natural double-blink with happy eye crease | Periodic ambient micro-motion |
| `WAVE` | Vẫy tay | One paw raised in friendly wave | App open, lesson start, greeting |
| `WALK` | Bước đi | Waddling comfortably with backpack | Map navigation |
| `CLIMB` | Leo trèo | Gripping branch playfully, looking up | Vertical map transitions |
| `SIT` | Ngồi học | Sitting on comfortable wood stump or cushion | Reading stories, listening to audio |
| `READ` | Đọc sách | Holding open colorful picture book | Story world, vocabulary introduction |
| `LISTEN` | Lắng nghe | Cupping one ear, leaning forward attentively | Listening comprehension activities |
| `THINK` | Suy nghĩ | Paw under chin, small question mark or lightbulb | Prompting hints, puzzling questions |
| `SPEAK` | Phát âm | Mouth open cheerfully, soundwave ripples | Speaking practice demonstration |
| `POINT` | Chỉ dẫn | Pointing paw toward key word or button | Highlighting learning focus |
| `CLAP` | Vỗ tay | Clapping paws happily | Correct answer, small win |
| `HAPPY` | Vui sướng | Eyes curved in joyful crescents, gentle bounce | Lesson streak, task completion |
| `PROUD` | Tự hào | Chest out, smiling warmly with thumbs up | Weakness recovered, unit milestone |
| `EXCITED` | Phấn khích | Jumping with stars in eyes | Level up, new world unlocked |
| `CURIOUS` | Tò mò | Head tilted slightly with wide eyes | Discovering new vocabulary |
| `ENCOURAGING`| Động viên | Warm smile, gentle nod, open arms | After a mistake ("Thử lại cùng Lười nhé") |
| `SURPRISED` | Ngạc nhiên | Mouth in cute 'O', eyes wide | Fun facts, surprise gift chest |
| `EAT` | Ăn táo | Munching on shiny red apple (PetFood) | Feeding interaction |
| `SLEEP` | Ngủ say | Curled up peacefully on hammock, 'Zzz' | Low energy, bedtime mode |
| `WAKE` | Thức dậy | Stretching arms, cute yawn | Morning login, waking pet |
| `CELEBRATE` | Đại tiệc | Wearing party hat, throwing colorful leaves | Unit mastery celebration |

---

## 3. Themed Visual Variants

- **Cozy Variant**: Wearing a cozy red knitted beanie (`cozy_knit_cap`) or warm striped scarf.
- **Explorer Variant**: Wearing an explorer safari hat with compass badge and miniature canvas backpack.
