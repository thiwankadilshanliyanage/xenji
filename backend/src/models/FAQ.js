import mongoose from 'mongoose';
const ml = { en: { type: String, trim: true, required: true }, ja: { type: String, trim: true, default: '' } };
const faqSchema = new mongoose.Schema({ question: ml, answer: ml, category:String, status:{type:String, enum:['draft','published'], default:'published'} }, {timestamps:true});
faqSchema.index({ 'question.en':'text','question.ja':'text','answer.en':'text','answer.ja':'text', category:'text' });
export default mongoose.model('FAQ', faqSchema);
