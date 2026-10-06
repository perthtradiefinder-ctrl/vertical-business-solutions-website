const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 }) : null;

document.querySelectorAll('.reveal').forEach((el) => {
  if (reducedMotion || !revealObserver) el.classList.add('visible');
  else revealObserver.observe(el);
});

const workflow = document.querySelector('[data-workflow]');
const workflowSteps = workflow ? Array.from(workflow.querySelectorAll('.workflow-step')) : [];
const progress = workflow?.querySelector('.workflow-progress span');
const dots = workflow?.querySelector('.workflow-dots');
const playButton = document.getElementById('play-workflow');
const previousButton = workflow?.querySelector('.previous-step');
const nextButton = workflow?.querySelector('.next-step');

let activeStep = 0;
let workflowTimer = null;
let hasAutoPlayed = false;

function buildDots() {
  if (!dots) return;
  workflowSteps.forEach((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Show workflow step ' + (index + 1));
    button.addEventListener('click', () => {
      stopWorkflow();
      setWorkflowStep(index, true);
    });
    dots.appendChild(button);
  });
}

function setWorkflowStep(index, scrollIntoView) {
  if (!workflowSteps.length) return;
  activeStep = Math.max(0, Math.min(workflowSteps.length - 1, index));
  workflowSteps.forEach((step, i) => {
    step.classList.toggle('active', i === activeStep);
    step.setAttribute('aria-pressed', String(i === activeStep));
  });
  if (progress) {
    const pct = workflowSteps.length <= 1 ? 100 : (activeStep / (workflowSteps.length - 1)) * 100;
    progress.style.width = pct + '%';
  }
  if (dots) {
    Array.from(dots.children).forEach((dot, i) => dot.classList.toggle('active', i === activeStep));
  }
  if (scrollIntoView && window.innerWidth <= 620) {
    workflowSteps[activeStep].scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }
}

function stopWorkflow() {
  if (workflowTimer) {
    clearInterval(workflowTimer);
    workflowTimer = null;
  }
}

function playWorkflow() {
  if (!workflowSteps.length || reducedMotion) {
    setWorkflowStep(0, true);
    return;
  }
  stopWorkflow();
  setWorkflowStep(0, true);
  workflowTimer = setInterval(() => {
    if (activeStep >= workflowSteps.length - 1) {
      stopWorkflow();
      return;
    }
    setWorkflowStep(activeStep + 1, true);
  }, 1350);
}

buildDots();
setWorkflowStep(0, false);

workflowSteps.forEach((step, index) => {
  step.addEventListener('click', () => {
    stopWorkflow();
    setWorkflowStep(index, true);
  });
});

playButton?.addEventListener('click', playWorkflow);
previousButton?.addEventListener('click', () => {
  stopWorkflow();
  setWorkflowStep((activeStep - 1 + workflowSteps.length) % workflowSteps.length, true);
});
nextButton?.addEventListener('click', () => {
  stopWorkflow();
  setWorkflowStep((activeStep + 1) % workflowSteps.length, true);
});

if (workflow && 'IntersectionObserver' in window && !reducedMotion) {
  const workflowObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting) && !hasAutoPlayed) {
      hasAutoPlayed = true;
      playWorkflow();
      workflowObserver.disconnect();
    }
  }, { threshold: 0.3 });
  workflowObserver.observe(workflow);
}

const params = new URLSearchParams(window.location.search);
const success = document.getElementById('form-success');
if (success && params.get('submitted') === 'true') {
  success.hidden = false;
}
