import { loginPath, loadSurveysPath, signUpPath, addSurveyPath, saveSurveyResultPath, loadSurveyResultPath } from './paths/'

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': { ...loadSurveysPath, ...addSurveyPath }, // como os dois endpoints possuem a mesma URL mesclei os arquivos separados
  '/surveys/{surveyId}/results': { ...saveSurveyResultPath, ...loadSurveyResultPath } // como os dois endpoints possuem a mesma URL mesclei os arquivos separados
}
