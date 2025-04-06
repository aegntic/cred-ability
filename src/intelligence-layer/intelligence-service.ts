import { logger } from '../common/logger';
import { ContextAnalyzer } from './context/context-analyzer';
import { CredentialContext, ContextualAnalysis, ContextGraph } from './context/types';
import { RecommendationEngine } from './recommendations/recommendation-engine';
import { SecurityRecommendation, RecommendationStatus, RotationPlan, AccessScopeRecommendation } from './recommendations/types';

/**
 * Main service for the Intelligence Layer
 * 
 * Coordinates between the context analyzer and recommendation engine
 * to provide comprehensive credential intelligence.
 */
export class IntelligenceService {
  private contextAnalyzer: ContextAnalyzer;
  private recommendationEngine: RecommendationEngine;
  
  constructor() {
    this.contextAnalyzer = new ContextAnalyzer();
    this.recommendationEngine = new RecommendationEngine();
    
    logger.info('Intelligence service initialized');
  }
  
  /**
   * Process a credential context to generate analysis and recommendations
   * 
   * @param context Credential context to process
   * @returns Analysis and recommendations
   */
  public async processCredentialContext(
    context: CredentialContext
  ): Promise<{
    analysis: ContextualAnalysis;
    recommendations: SecurityRecommendation[];
  }> {
    try {
      logger.info('Processing credential context', {
        credentialId: context.credentialId,
        type: context.credentialType,
        service: context.service
      });
      
      // Analyze the context
      const analysis = this.contextAnalyzer.analyzeContext(context);
      
      // Generate recommendations based on the analysis
      const recommendations = this.recommendationEngine.generateRecommendations(analysis);
      
      return {
        analysis,
        recommendations
      };
    } catch (error) {
      logger.error('Error processing credential context', {
        credentialId: context.credentialId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }
  
  /**
   * Get the analysis for a credential
   * 
   * @param credentialId ID of the credential
   * @returns Analysis or null if not found
   */
  public getAnalysis(credentialId: string): ContextualAnalysis | null {
    return this.contextAnalyzer.getAnalysis(credentialId);
  }
  
  /**
   * Get recommendations for a credential
   * 
   * @param credentialId ID of the credential
   * @returns Array of recommendations
   */
  public getRecommendations(credentialId: string): SecurityRecommendation[] {
    return this.recommendationEngine.getRecommendations(credentialId);
  }
  
  /**
   * Update the status of a recommendation
   * 
   * @param recommendationId ID of the recommendation
   * @param status New status
   * @returns Updated recommendation or null if not found
   */
  public updateRecommendationStatus(
    recommendationId: string,
    status: RecommendationStatus
  ): SecurityRecommendation | null {
    return this.recommendationEngine.updateRecommendationStatus(recommendationId, status);
  }
  
  /**
   * Build a context graph for a credential
   * 
   * @param credentialId ID of the credential
   * @returns Context graph
   */
  public buildContextGraph(credentialId: string): ContextGraph {
    return this.contextAnalyzer.buildContextGraph(credentialId);
  }
  
  /**
   * Create a rotation plan for a credential
   * 
   * @param credentialId ID of the credential
   * @returns Rotation plan or null if not needed
   */
  public createRotationPlan(credentialId: string): RotationPlan | null {
    return this.recommendationEngine.createRotationPlan(credentialId);
  }
  
  /**
   * Create an access scope recommendation for a credential
   * 
   * @param credentialId ID of the credential
   * @returns Access scope recommendation or null if not needed
   */
  public createAccessScopeRecommendation(credentialId: string): AccessScopeRecommendation | null {
    return this.recommendationEngine.createAccessScopeRecommendation(credentialId);
  }
}
