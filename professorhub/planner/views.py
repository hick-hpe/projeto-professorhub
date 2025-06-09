
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required(login_url='index')  # nome da rota para onde redireciona se não estiver logado
def admin_dashboard(request):
    return render(request, 'planner/admin_dashboard.html')



def disciplinas(request):
    return render(request, 'planner/disciplinas.html')

def tarefas(request):
    return render(request, 'planner/tarefas.html')


