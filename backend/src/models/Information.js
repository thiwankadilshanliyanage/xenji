import mongoose from 'mongoose';
const ml = { en: { type: String, trim: true, required: true }, ja: { type: String, trim: true, default: '' } };
const informationSchema = new mongoose.Schema({
 title: ml, slug: { type:String, unique:true, index:true }, category: { type:String, required:true, index:true }, summary: ml, content: ml,
 officialSourceLink: String, thumbnailImage: String, status: { type:String, enum:['draft','published','archived'], default:'draft' }, isImportant: { type:Boolean, default:false }, isFeatured: { type:Boolean, default:false }, publishedAt: Date, createdBy: { type: mongoose.Schema.Types.ObjectId, ref:'User' }
}, { timestamps:true });
informationSchema.index({ 'title.en':'text', 'title.ja':'text', 'summary.en':'text', 'summary.ja':'text', 'content.en':'text', 'content.ja':'text', category:'text' });
export default mongoose.model('Information', informationSchema);
