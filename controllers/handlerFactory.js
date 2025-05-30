const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const deleteOne = Model => catchAsync(
    async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        // if there is no document, we send 404 not found response.
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        // Status '204' means no content, so we send 'null'. 
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
);

const updateOne = Model => catchAsync(
    async (req, res, next) => {
        // All the find methods on a model are query methods.
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            // returns the object after updation.
            new: true,
            // the validators specified in the schema will run when 
            // document is updated.
            runValidators: true
        });

        // if there is no document, we send 404 not found response.
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            },
        });
    }
);

const createOne = Model => catchAsync(
    async (req, res, next) => {
        const newDoc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: newDoc
            },
        });
    }
);

const getOne = (Model, populateOptions) => catchAsync(
    async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populateOptions) query = query.populate(populateOptions);
        const doc = await query;

        // if there is no document, we send 404 not found response.
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            },
        });
    }
);

const getAll = Model => catchAsync(
    async (req, res, next) => {
        // To allow nested GET reviews on tours.
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        // Build query
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const query = features.query;

        // Build document
        const doc = await query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc
            },
        });
    }
);

module.exports = {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
}