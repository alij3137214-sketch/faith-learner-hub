INSERT INTO public.scholars (slug, name, title, biography, era, accent_color, sort_order) VALUES
('khamenei','Ayatollah Sayyid Ali Khamenei','Contemporary Islamic Scholar & Jurist',
'A contemporary Islamic scholar and jurist whose writings and lectures span ethics, spirituality, jurisprudence, social justice, family life and the responsibilities of youth. This library indexes published books, speeches, letters, interviews and statements so learners can study them directly from the source.',
'Contemporary','#0f7a5a',0);

INSERT INTO public.documents (scholar_id, type, title, summary, body, category, topic, source, published_at, tags, reading_minutes, xp_reward) VALUES
((SELECT id FROM public.scholars WHERE slug='khamenei'),'book','Foundations of Spiritual Discipline','An introduction to self-refinement, intention and the daily habits that shape character.',
'Self-refinement begins with attention. The one who does not watch over the movements of the heart cannot expect the limbs to remain upright.

Intention is the root of every action. Two people may perform the same outward deed, yet one ascends by it and the other is unchanged, because the intention behind each differed.

Discipline is not severity. It is the steady repetition of small, sincere acts: a fixed time for reflection, a guarded tongue, honesty in trade, patience within the family. What is small and constant outweighs what is large and occasional.

Knowledge without practice becomes a burden. Practice without knowledge becomes confusion. The seeker joins the two, learning in order to act, and acting in order to understand more deeply.

Do not despair over lapses. The path of refinement is measured over years, not days. What matters is that the direction of travel remains toward truth.',
'Ethics','Self-Refinement','Published collection','2019-04-12','{ethics,spirituality,character}',9,30),

((SELECT id FROM public.scholars WHERE slug='khamenei'),'speech','On the Responsibility of Youth','A lecture on knowledge, purpose and the role of young people in building a just society.',
'The young carry a trust. Energy, time and clarity of mind are given in abundance in youth, and each of these will be asked about.

Do not measure your worth by what you consume. Measure it by what you build. A generation that only receives will not be remembered; a generation that produces knowledge, justice and service leaves a mark that outlives it.

Study seriously. Superficial familiarity with many subjects is weaker than deep mastery of one. Depth produces independence of thought, and independence of thought protects a community from being led by slogans.

Guard against despair. Despair is engineered; it is often the goal of those who wish a people to remain passive. The remedy is small, concrete, continuous work.

Finally, keep your character ahead of your achievements. Ability without integrity harms more than incapacity ever could.',
'Society','Youth','Public address','2021-05-02','{youth,knowledge,society}',7,25),

((SELECT id FROM public.scholars WHERE slug='khamenei'),'article','Justice as a Social Obligation','Why justice is treated as a communal duty rather than an individual preference.',
'Justice is not merely the absence of open oppression. It is the presence of arrangements in which the weak are not quietly disadvantaged.

A society may have laws and still be unjust, if those laws are applied unevenly, or if access to them depends on wealth and connection.

Therefore the obligation of justice falls on the community as a whole, not only on the judge. The merchant who prices fairly, the teacher who does not favour, the official who refuses privilege — each maintains a part of the structure.

Where injustice is normalised, speech is the first duty. Where speech is possible and refused, silence becomes participation.',
'Society','Justice','Published essay','2018-11-20','{justice,society,ethics}',6,20),

((SELECT id FROM public.scholars WHERE slug='khamenei'),'letter','A Letter on Reading and Reflection','Correspondence encouraging deep reading and the discipline of reflection.',
'You asked what to read. Read less, and return to it more often.

A book read once informs. A book returned to across years forms. Keep a small number of serious works close, and let the rest pass through you.

Write as you read. Reflection that is never articulated dissolves. Even a few lines recording what you understood, and what you did not, will show you your own progress after a year.

And read what disagrees with you. A conviction that has never been tested is an inheritance, not a belief.',
'Knowledge','Reading','Correspondence','2020-02-14','{reading,reflection,knowledge}',4,15),

((SELECT id FROM public.scholars WHERE slug='khamenei'),'interview','On Family and Community Life','An interview covering family responsibility, upbringing and neighbourly duty.',
'The family is the first school, and its curriculum is behaviour rather than instruction. Children absorb what is practised long before they understand what is preached.

Kindness within the home is not a private matter. A household in which mercy is habitual sends out people who are merciful in public life.

The neighbour has a right that many have forgotten. To know nothing of the condition of the household beside you is a deficiency, not a form of privacy.

Community begins where convenience ends.',
'Family','Community','Recorded interview','2017-09-08','{family,community,upbringing}',5,20),

((SELECT id FROM public.scholars WHERE slug='khamenei'),'statement','On the Ethics of Speech','A short statement on truthfulness, rumour and the weight of words.',
'A word is an action. It moves people, and once moved, they are difficult to return.

Verify before transmitting. Repeating what one has not verified is not neutrality; it is participation in whatever consequence follows.

Avoid mockery. It costs the speaker nothing and can cost the subject a great deal.

The measure of speech is not how clever it sounds, but what it leaves behind.',
'Ethics','Speech','Public statement','2022-03-01','{ethics,speech,truthfulness}',3,15),

((SELECT id FROM public.scholars WHERE slug='khamenei'),'qa','Questions on Daily Worship','Responses to common questions about consistency and sincerity in daily worship.',
'Q: What should be done when worship feels mechanical?
A: Reduce quantity before abandoning quality. A shorter act performed with presence restores what a longer distracted act erodes.

Q: How is sincerity maintained when others observe?
A: By intending, before beginning, that the act is not for them — and by not adjusting it when they are absent.

Q: Is consistency more important than intensity?
A: The steady act, even if small, is the more reliable path. Intensity that cannot be sustained often ends in abandonment.',
'Worship','Daily Practice','Q&A collection','2021-12-10','{worship,practice,sincerity}',4,15);

-- LEARNING PATHS
INSERT INTO public.learning_paths (scholar_id, slug, title, description, difficulty, xp_reward, coin_reward, sort_order) VALUES
((SELECT id FROM public.scholars WHERE slug='khamenei'),'foundations','Foundations of Character','Begin your journey: intention, discipline and the habits that shape a seeker of knowledge.','Beginner',150,40,0),
((SELECT id FROM public.scholars WHERE slug='khamenei'),'justice-society','Justice & Society','Study how justice is framed as a shared obligation across essays, statements and speeches.','Intermediate',200,60,1),
((SELECT id FROM public.scholars WHERE slug='khamenei'),'knowledge-path','The Path of Knowledge','Reading, reflection and the responsibility that comes with learning.','Beginner',180,50,2);

INSERT INTO public.quizzes (scholar_id, title, description, topic, xp_reward) VALUES
((SELECT id FROM public.scholars WHERE slug='khamenei'),'Foundations Checkpoint','Test your understanding of intention and discipline.','Self-Refinement',60),
((SELECT id FROM public.scholars WHERE slug='khamenei'),'Justice Checkpoint','Review the communal nature of justice.','Justice',60);

INSERT INTO public.quiz_questions (quiz_id, kind, prompt, options, answer, explanation, position) VALUES
((SELECT id FROM public.quizzes WHERE title='Foundations Checkpoint'),'mcq','According to the reading, what is described as the root of every action?','{"Intention","Reputation","Effort","Knowledge"}','Intention','Two identical outward deeds differ entirely because of the intention behind them.',0),
((SELECT id FROM public.quizzes WHERE title='Foundations Checkpoint'),'truefalse','Discipline is described as severity and harshness toward oneself.','{"True","False"}','False','Discipline is defined as the steady repetition of small, sincere acts.',1),
((SELECT id FROM public.quizzes WHERE title='Foundations Checkpoint'),'fill_blank','Knowledge without practice becomes a ______.','{}','burden','The text pairs this with "practice without knowledge becomes confusion".',2),
((SELECT id FROM public.quizzes WHERE title='Justice Checkpoint'),'mcq','Justice is described as an obligation falling on whom?','{"Only the judge","The community as a whole","Only rulers","Only the wealthy"}','The community as a whole','Merchants, teachers and officials each maintain part of the structure.',0),
((SELECT id FROM public.quizzes WHERE title='Justice Checkpoint'),'truefalse','A society with written laws is automatically just.','{"True","False"}','False','Laws applied unevenly still produce injustice.',1),
((SELECT id FROM public.quizzes WHERE title='Justice Checkpoint'),'short_answer','In one word: where injustice is normalised, what is the first duty?','{}','speech','The text names speech as the first duty.',2);

INSERT INTO public.path_items (path_id, kind, title, content, document_id, quiz_id, xp_reward, position) VALUES
((SELECT id FROM public.learning_paths WHERE slug='foundations'),'lesson','Why Character Comes First','Character is the container for everything else you will learn. Before studying widely, establish how you will act on what you learn.',NULL,NULL,20,0),
((SELECT id FROM public.learning_paths WHERE slug='foundations'),'document','Read: Foundations of Spiritual Discipline',NULL,(SELECT id FROM public.documents WHERE title='Foundations of Spiritual Discipline'),NULL,30,1),
((SELECT id FROM public.learning_paths WHERE slug='foundations'),'reflection','Reflect: Your Smallest Consistent Act','Name one small act you could sustain daily for a year. Write why it matters more than a larger act you would abandon.',NULL,NULL,25,2),
((SELECT id FROM public.learning_paths WHERE slug='foundations'),'quiz','Foundations Checkpoint',NULL,NULL,(SELECT id FROM public.quizzes WHERE title='Foundations Checkpoint'),60,3),
((SELECT id FROM public.learning_paths WHERE slug='foundations'),'reward','Path Complete: Seeker Badge','You have completed the foundations of character.',NULL,NULL,40,4),

((SELECT id FROM public.learning_paths WHERE slug='justice-society'),'lesson','What Justice Requires','Justice is structural, not only personal. This lesson frames the difference.',NULL,NULL,20,0),
((SELECT id FROM public.learning_paths WHERE slug='justice-society'),'document','Read: Justice as a Social Obligation',NULL,(SELECT id FROM public.documents WHERE title='Justice as a Social Obligation'),NULL,30,1),
((SELECT id FROM public.learning_paths WHERE slug='justice-society'),'document','Read: On the Responsibility of Youth',NULL,(SELECT id FROM public.documents WHERE title='On the Responsibility of Youth'),NULL,30,2),
((SELECT id FROM public.learning_paths WHERE slug='justice-society'),'reflection','Reflect: One Unjust Arrangement','Identify one arrangement around you that quietly disadvantages the weak. What could be changed?',NULL,NULL,25,3),
((SELECT id FROM public.learning_paths WHERE slug='justice-society'),'quiz','Justice Checkpoint',NULL,NULL,(SELECT id FROM public.quizzes WHERE title='Justice Checkpoint'),60,4),

((SELECT id FROM public.learning_paths WHERE slug='knowledge-path'),'lesson','How to Read Seriously','Depth over breadth: how returning to a few works forms the mind.',NULL,NULL,20,0),
((SELECT id FROM public.learning_paths WHERE slug='knowledge-path'),'document','Read: A Letter on Reading and Reflection',NULL,(SELECT id FROM public.documents WHERE title='A Letter on Reading and Reflection'),NULL,30,1),
((SELECT id FROM public.learning_paths WHERE slug='knowledge-path'),'document','Read: On the Ethics of Speech',NULL,(SELECT id FROM public.documents WHERE title='On the Ethics of Speech'),NULL,30,2),
((SELECT id FROM public.learning_paths WHERE slug='knowledge-path'),'reflection','Reflect: A Belief You Have Not Tested','Write about one conviction you hold that you have never seriously examined from the other side.',NULL,NULL,25,3);

-- ACHIEVEMENTS
INSERT INTO public.achievements (code, title, description, icon, xp_reward, coin_reward, tier) VALUES
('first_read','First Light','Read your first document from the library.','book-open',50,10,'bronze'),
('five_reads','Steady Reader','Complete five readings.','library',120,25,'silver'),
('first_quiz','Checkpoint Cleared','Pass your first quiz.','check-circle',80,15,'bronze'),
('path_complete','Path Walker','Complete an entire learning path.','route',200,50,'gold'),
('streak_7','Seven Days','Maintain a seven day learning streak.','flame',150,40,'silver'),
('streak_30','Thirty Days','Maintain a thirty day learning streak.','trophy',500,150,'gold'),
('curious_mind','Curious Mind','Ask the knowledge assistant ten questions.','sparkles',100,20,'silver'),
('level_5','Rising Scholar','Reach level five.','trending-up',150,30,'silver');

-- MISSIONS
INSERT INTO public.missions (code, title, description, cadence, target, xp_reward, coin_reward) VALUES
('daily_read','Read one passage','Open and finish reading one document today.','daily',1,30,5),
('daily_lesson','Complete a lesson','Finish one lesson inside any learning path.','daily',1,40,8),
('daily_ask','Ask the assistant','Ask the knowledge assistant one question.','daily',1,20,4),
('weekly_quiz','Pass three checkpoints','Pass three quizzes this week.','weekly',3,150,40),
('weekly_paths','Advance two paths','Make progress in two different learning paths.','weekly',2,120,30);

-- AVATAR ITEMS
INSERT INTO public.avatar_items (slot, code, name, value, rarity, unlock_type, unlock_value, sort_order) VALUES
('skin','light','Light','#f2d3b3','common','free',0,0),
('skin','medium','Medium','#d9a577','common','free',0,1),
('skin','tan','Tan','#b9814f','common','free',0,2),
('skin','deep','Deep','#8a5a33','common','free',0,3),
('hair','short','Short','short','common','free',0,0),
('hair','wavy','Wavy','wavy','common','free',0,1),
('hair','long','Long','long','common','free',0,2),
('hair','bald','Clean','bald','common','free',0,3),
('hairColor','black','Black','#1c1a17','common','free',0,0),
('hairColor','brown','Brown','#4a2f1d','common','free',0,1),
('hairColor','auburn','Auburn','#7b3b21','common','level',3,2),
('hairColor','silver','Silver','#b9b6ae','rare','level',8,3),
('beard','none','None','none','common','free',0,0),
('beard','stubble','Stubble','stubble','common','free',0,1),
('beard','full','Full','full','common','free',0,2),
('beard','long','Long','long','rare','level',5,3),
('brows','soft','Soft','soft','common','free',0,0),
('brows','strong','Strong','strong','common','free',0,1),
('headwear','none','None','none','common','free',0,0),
('headwear','cap','Cap','cap','common','free',0,1),
('headwear','turban_white','White Turban','turban:#f6f3ea','rare','xp',500,2),
('headwear','turban_black','Black Turban','turban:#1f2622','epic','xp',1500,3),
('headwear','hijab_ivory','Ivory Hijab','hijab:#f6f3ea','common','free',0,4),
('headwear','hijab_emerald','Emerald Hijab','hijab:#0f7a5a','rare','level',4,5),
('headwear','service_cap','Service Cap','service','epic','achievement',1,6),
('outfit','robe_ivory','Ivory Robe','#efe9dc','common','free',0,0),
('outfit','robe_emerald','Emerald Robe','#0f7a5a','common','free',0,1),
('outfit','hoodie_charcoal','Charcoal Hoodie','#2b2f2d','common','free',0,2),
('outfit','jacket_olive','Olive Jacket','#5b6444','rare','level',3,3),
('outfit','robe_gold','Gold-Trimmed Robe','#c9a227','epic','xp',2000,4),
('outfit','uniform_dress','Ceremonial Uniform','#38443c','epic','streak',14,5),
('background','dawn','Dawn','dawn','common','free',0,0),
('background','emerald','Emerald Field','emerald','common','free',0,1),
('background','night','Night Geometry','night','rare','level',5,2),
('background','gold','Gilded','gold','epic','xp',3000,3),
('frame','none','None','none','common','free',0,0),
('frame','thin','Thin Ring','thin','common','free',0,1),
('frame','geometric','Geometric','geometric','rare','level',6,2),
('frame','gold','Gold Laurel','gold','legendary','streak',30,3);
