import {Router} from 'express';
import { cadastraUsuarioController, listaUsuarioController, buscaUsuarioPorIdController } from './usuarios.controller.js';

export const usuariosRouter = Router();

usuariosRouter.post('/', cadastraUsuarioController)
usuariosRouter.get('/', listaUsuarioController)
usuariosRouter.get('/:id', buscaUsuarioPorIdController)

// to-do
// patch /:id
// patch /:id/desativar