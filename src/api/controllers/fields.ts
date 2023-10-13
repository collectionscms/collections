import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { modelPermissionsHandler, permissionsHandler } from '../middleware/permissionsHandler.js';
import { FieldsService } from '../services/fields.js';

const router = express.Router();

router.get(
  '/models/:modelId/fields',
  modelPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new FieldsService({ schema: req.schema });
    const fields = await service.getFields(req.params.modelId);

    const fieldWithOptions = fields.map((field) => {
      return {
        ...field,
        fieldOption: field.options ? JSON.parse(field.options) : null,
      };
    });

    res.json({
      fields: fieldWithOptions,
    });
  })
);

router.post(
  '/fields',
  permissionsHandler([{ model: 'CollectionsFields', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new FieldsService({ schema: req.schema });
    const field = await service.createField(req.body);

    res.json({ field });
  })
);

/**
 * Add relational fields.
 */
router.post(
  '/fields/relations',
  permissionsHandler([{ model: 'CollectionsFields', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const fieldsService = new FieldsService({ schema: req.schema });
    const fields = await fieldsService.createRelationalFields(req.body.relation, req.body.fields);

    res.json({ fields });
  })
);

router.patch(
  '/fields',
  permissionsHandler([{ model: 'CollectionsFields', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new FieldsService({ schema: req.schema });

    await service.database.transaction(async (tx) => {
      const transactingService = new FieldsService({ database: tx, schema: req.schema });
      for (const field of req.body) {
        await transactingService.updateOne(field.id, field);
      }
    });

    res.status(204).end();
  })
);

router.patch(
  '/fields/:id',
  permissionsHandler([{ model: 'CollectionsFields', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const service = new FieldsService({ schema: req.schema });
    await service.updateField(id, req.body);

    res.status(204).end();
  })
);

/**
 * Delete fields.
 * Execute in order of relation -> entity to avoid DB constraint errors.
 */
router.delete(
  '/models/:modelId/fields/:id',
  permissionsHandler([{ model: 'CollectionsFields', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const fieldId = Number(req.params.id);

    const service = new FieldsService({ schema: req.schema });
    await service.deleteField(fieldId);

    res.status(204).end();
  })
);

export const fields = router;
