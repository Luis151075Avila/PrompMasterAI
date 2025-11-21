import { GoogleGenAI } from "@google/genai";
import { UserSelections } from "../types";

// Initialize API Client
// NOTE: API_KEY must be provided in the environment
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a refined prompt based on user inputs using a meta-prompting strategy.
 */
export const generateRefinedPrompt = async (selections: UserSelections): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found in environment variables.");

  const task = selections.taskType === "Otro" ? selections.taskTypeOther : selections.taskType;
  const role = selections.role === "Otro" ? selections.roleOther : selections.role;
  const audience = selections.audience === "Otro" ? selections.audienceOther : selections.audience;
  const resources = selections.additionalResources === "Otro" ? selections.additionalResourcesOther : selections.additionalResources;
  const depth = selections.depth.join(", ");
  
  // Format the diagram request string
  let diagramRequest = "No solicitado";
  if (selections.diagramType) {
    diagramRequest = `Incluir ${selections.diagramType}`;
    if (selections.diagramConcept) {
      diagramRequest += ` para representar: "${selections.diagramConcept}"`;
    }
    // Add instruction for Mermaid.js if it's a diagram
    diagramRequest += ". Si es posible, usar sintaxis Mermaid.js o ASCII art para la representación visual.";
  }

  const systemInstruction = `
    Actúa como un Ingeniero de Prompts (Prompt Engineer) experto y de clase mundial.
    Tu objetivo es tomar los requisitos crudos de un usuario y reescribirlos en un PROMPT perfecto, detallado y optimizado para un Modelo de Lenguaje Grande (LLM).
    
    Estructura el prompt resultante para que incluya claramente:
    1. Rol (Persona)
    2. Contexto
    3. Tarea Específica (incluyendo diagramas si se solicitan)
    4. Requisitos de Contenido y Recursos
    5. Restricciones, Estilo de Citación y Formato
    6. Tono y Audiencia
    
    NO ejecutes la tarea. SOLO escribe el prompt que el usuario debería usar.
    El resultado debe estar listo para ser copiado y pegado.
  `;

  const userContent = `
    Por favor construye un prompt optimizado basado en los siguientes parámetros:

    - **Tarea a realizar:** ${task}
    - **Profundidad/Amplitud:** ${depth || "No especificado"}
    - **Contexto:** ${selections.context || "No especificado"}
    - **Ejemplos de entrada (Contexto):** ${selections.examples || "Ninguno"}
    - **Rol a asumir:** ${role}
    - **Requisito de Diagrama Visual:** ${diagramRequest}
    - **Recursos adicionales requeridos:** ${resources || "Ninguno"}
    - **Formato de citación:** ${selections.citationStyle || "No especificado"}
    - **Solicitud de ejemplos específicos en la salida:** ${selections.specificExamples || "No solicitado"}
    - **Audiencia objetivo:** ${audience}
    - **Formato de salida requerido:** ${selections.format}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userContent,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "No se pudo generar el prompt.";
  } catch (error: any) {
    console.error("Error generating refined prompt:", error);
    throw new Error(error.message || "Error al conectar con Gemini API.");
  }
};

/**
 * Executes the final refined prompt to get the actual result.
 * Uses gemini-3-pro-preview for higher reasoning capabilities on the final output.
 */
export const executeFinalPrompt = async (prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found.");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for better complex task handling
      contents: prompt,
      config: {
        temperature: 0.3, // Lower temperature for more precise adherence to the prompt
      }
    });

    return response.text || "No se generó respuesta.";
  } catch (error: any) {
    console.error("Error executing final prompt:", error);
    throw new Error(error.message || "Error al ejecutar el prompt.");
  }
};