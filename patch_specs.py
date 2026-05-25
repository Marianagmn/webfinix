from pathlib import Path
import re
files=[
 'src/app/app.spec.ts',
 'src/app/components/personal-finance/transaction-create/transaction-create.spec.ts',
 'src/app/components/business-finance/approval-detail/approval-detail.spec.ts',
 'src/app/components/accounts/account-create/account-create.spec.ts',
 'src/app/components/personal-finance/transaction-edit/transaction-edit.spec.ts',
 'src/app/components/auth/login/login.spec.ts',
 'src/app/components/personal-finance/transaction-list/transaction-list.spec.ts',
 'src/app/components/auth/register/register.spec.ts',
 'src/app/components/business-finance/business-create/business-create.spec.ts',
 'src/app/components/business-finance/approval-list/approval-list.spec.ts',
 'src/app/components/categories/category-edit/category-edit.spec.ts',
 'src/app/components/categories/category-create/category-create.spec.ts',
 'src/app/components/business-finance/business-edit/business-edit.spec.ts',
 'src/app/components/user/profile/profile.spec.ts',
 'src/app/components/user/change-password/change-password.spec.ts',
 'src/app/components/business-finance/business-list/business-list.spec.ts',
 'src/app/components/personal-finance/prediction-view/prediction-view.spec.ts',
 'src/app/components/personal-finance/simulation-view/simulation-view.spec.ts',
 'src/app/components/personal-finance/analysis-view/analysis-view.spec.ts',
 'src/app/components/accounts/account-edit/account-edit.spec.ts',
 'src/app/components/accounts/account-list/account-list.spec.ts',
]
for rel in files:
    path = Path(rel)
    if not path.exists():
        print('missing', rel)
        continue
    text = path.read_text(encoding='utf-8')
    modified = False
    if 'RouterTestingModule' not in text:
        text = re.sub(r"(import \{ ComponentFixture, TestBed \} from '@angular/core/testing';\s*)", r"\1import { RouterTestingModule } from '@angular/router/testing';\n", text, count=1)
        modified = True
    if 'HttpClientTestingModule' not in text:
        text = re.sub(r"(import .*@angular/core/testing';\s*)", r"\1import { HttpClientTestingModule } from '@angular/common/http/testing';\n", text, count=1)
        modified = True
    if 'ToastrModule' not in text:
        text = re.sub(r"(import .*@angular/core/testing';\s*)", r"\1import { ToastrModule } from 'ngx-toastr';\n", text, count=1)
        modified = True
    def repl(match):
        comp = match.group(1)
        return f"    imports: [{comp}, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],"
    new_text, n = re.subn(r"\s*imports:\s*\[([^\]]+)\],", repl, text)
    if n > 0:
        text = new_text
        modified = True
    if modified:
        path.write_text(text, encoding='utf-8')
        print('patched', rel)
