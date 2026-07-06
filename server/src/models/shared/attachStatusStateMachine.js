
export function attachStatusStateMachine(schema, { field = 'status', transitions }) {
  
  schema.pre('save', function guardSaveTransition(next) {
    if (this.isNew || !this.isModified(field)) return next();

    const previous = this._original?.[field];
    const next_ = this[field];
    if (previous && previous !== next_ && !(transitions[previous] || []).includes(next_)) {
      return next(new Error(`Illegal ${field} transition: ${previous} -> ${next_}`));
    }
    return next();
  });

  schema.post('init', function cacheOriginalOnLoad() {
    this._original = { ...(this._original || {}), [field]: this[field] };
  });

  schema.post('save', function cacheOriginalAfterSave() {
    this._original = { ...(this._original || {}), [field]: this[field] };
  });


  schema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], async function guardQueryTransition(next) {
    const update = this.getUpdate() || {};
    const nextValue = update[field] ?? update.$set?.[field];
    if (nextValue === undefined) return next(); 

    if (this.op === 'updateMany') {
      return next(
        new Error(
          `Bulk ${field} transitions via updateMany are not permitted — update documents ` +
            'individually (updateOne/findOneAndUpdate/save) so each transition can be validated.'
        )
      );
    }

    const current = await this.model.findOne(this.getFilter()).select(field).lean();
    if (!current) return next(); 

    const previous = current[field];
    if (previous && previous !== nextValue && !(transitions[previous] || []).includes(nextValue)) {
      return next(new Error(`Illegal ${field} transition: ${previous} -> ${nextValue}`));
    }
    return next();
  });
}
