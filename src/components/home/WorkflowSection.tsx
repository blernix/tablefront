'use client';

import {
  AnimatedWorkflowStep,
  AnimatedCircle,
  AnimatedTitle,
  AnimatedText,
} from '@/components/AnimatedWorkflow';

export default function WorkflowSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
            Logiciel réservation restaurant complet : de la réservation à l&apos;avis client
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
            Installation en 5 minutes. Gestion depuis votre mobile. Avis Google automatisés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedWorkflowStep delay={0} className="text-center space-y-6">
            <AnimatedCircle delay={0.1}>1</AnimatedCircle>
            <AnimatedTitle delay={0.2}>Captez vos clients</AnimatedTitle>
            <AnimatedText delay={0.3}>
              Intégrez notre bouton flottant discret sur votre site ou partagez votre lien unique
              sur les réseaux. Vos clients réservent en deux clics.
            </AnimatedText>
          </AnimatedWorkflowStep>

          <AnimatedWorkflowStep delay={0.2} className="text-center space-y-6">
            <AnimatedCircle delay={0.3}>2</AnimatedCircle>
            <AnimatedTitle delay={0.4}>Pilotez en temps réel</AnimatedTitle>
            <AnimatedText delay={0.5}>
              Recevez une notification instantanée sur votre mobile. Acceptez ou refusez la demande
              d&apos;un simple geste. Votre client reçoit immédiatement une confirmation
              personnalisée.
            </AnimatedText>
          </AnimatedWorkflowStep>

          <AnimatedWorkflowStep delay={0.4} className="text-center space-y-6">
            <AnimatedCircle delay={0.5}>3</AnimatedCircle>
            <AnimatedTitle delay={0.6}>Boostez votre réputation</AnimatedTitle>
            <AnimatedText delay={0.7}>
              Le service est terminé ? Marquez la table comme &quot;Terminée&quot;. TableMaster
              envoie automatiquement un email de remerciement avec un lien direct pour laisser un
              avis Google.
            </AnimatedText>
          </AnimatedWorkflowStep>
        </div>
      </div>
    </section>
  );
}
